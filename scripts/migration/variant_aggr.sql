--
-- XTENS 2 PostgreSQL database migration from 2.0 to 2.1
--
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
--
-- Name: group_projects__project_groups; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--
CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET search_path = public, pg_catalog;

DROP FUNCTION variant_aggregation();

CREATE OR REPLACE FUNCTION variant_aggregation() RETURNS int[] AS $$
  DECLARE
      join_id integer = 0;
      c integer = 0;
      first_ID integer = 0;
      uniq_variant RECORD;
      variant RECORD;
      first BOOLEAN = false;
      arr integer[]  DEFAULT '{}'::integer[];
      clause TEXT;
      v_sql_dynamic varchar(1000) = '';
  BEGIN

      RAISE info 'Start variant_aggregation';

    -- create data_types for every project
      FOR uniq_variant IN SELECT distinct
            MIN(d.id) as id,
            d.metadata->'chr'->>'value' as chr,
            d.metadata->'pos'->>'value' as pos,
            d.metadata->'ref'->>'value' as ref,
            d.metadata->'alt'->>'value' as alt FROM data d
            join data_type dt on dt.id = d.type
            join super_type s on dt.super_type =  s.id and s.id = 112
            group by d.metadata->'alt'->>'value', d.metadata->'ref'->>'value', d.metadata->'pos'->>'value', d.metadata->'chr'->>'value'
            order by id asc
            LOOP

      -- da questa select recupero tutti i dati che cambiano tra le varianti
      v_sql_dynamic := 'SELECT distinct d.id  FROM data d join data_type dt on dt.id = d.type join super_type s on dt.super_type =  s.id and s.id = 112
            where
            metadata @> ''{"chr":{"value":"' || uniq_variant.chr || '" }}'' AND
            metadata @> ''{"pos":{"value":' || uniq_variant.pos || ' }}'' AND
            metadata @> ''{"ref":{"value":"' || uniq_variant.ref || '" }}'' AND
            metadata @> ''{"alt":{"value":"' || uniq_variant.alt || '" }}''
            order by d.id asc';



            FOR variant IN EXECUTE v_sql_dynamic
				LOOP
        RAISE info 'UNIQUE Variant %, CURRENT variant %', uniq_variant.id, variant.id;
        IF first = FALSE AND variant.id = uniq_variant.id THEN
          first_ID := uniq_variant.id;
          first := TRUE;
          RAISE info 'MASTER Variant %', first_ID;
        ELSE
            -- RAISE info 'Perform update join table id %, master id %', variant.id, first_ID;
            --select id INTO join_id from data_childrendata__data_parentdata where "data_parentData" = variant.id;

            EXECUTE 'UPDATE data_childrendata__data_parentdata SET "data_parentData"=' || quote_literal(first_ID) || ' WHERE "data_parentData" = ' || quote_literal(variant.id);--' WHERE id = ' || quote_literal(join_id);
            arr:= array_append(arr,variant.id)::INT[];
            RAISE info 'Added Variant %, array length %', variant.id, array_length(arr,1);
        END IF;

        IF (array_length(arr, 1) >= 100) THEN
          clause := arr;
          clause := trim(leading '{' FROM clause);
          clause := trim(trailing '}' FROM clause);
          -- execute 'WITH row_deleted AS (delete from data where id IN (' || clause || ') RETURNING *) SELECT count(*) FROM row_deleted' into c;
          execute 'delete from data where id IN (' || clause || ')';
          arr := '{}'::integer[];
        END IF;
        --se la prima salvo il suo id e diventa la master
        -- salvarmi da qualche parte le info uniche della variante ( campo supplementare nella join table?) (ora tralascio e perdo le differenze per il pooling)
        -- e sostituisco nella join table l'id della variante master
        -- elimino la variante corrente



        END LOOP;
        --finito il ciclo su una variante master rinizializzo a false first e master
        --init first
        first := FALSE;
        first_ID := 0;
      END LOOP;

      IF (array_length(arr, 1) > 0) THEN
        clause := arr;
        clause := trim(leading '{' FROM clause);
        clause := trim(trailing '}' FROM clause);
        -- execute 'WITH row_deleted AS (delete from data where id IN (' || clause || ') RETURNING *) SELECT count(*) FROM row_deleted' into c;
        execute 'delete from data where id IN (' || clause || ')';
        arr := '{}'::integer[];
      END IF;

      RAISE info 'Done creating data parents migration.';
      RETURN arr;
  END;
 $$ LANGUAGE plpgsql;




DROP FUNCTION main_migration(int);

CREATE OR REPLACE FUNCTION main_migration() RETURNS integer AS $$

  BEGIN
    PERFORM variant_aggregation();

    DROP FUNCTION variant_aggregation();

    RETURN 1;
  END;
$$ LANGUAGE plpgsql;


SELECT * FROM main_migration();-- set the id of default project
