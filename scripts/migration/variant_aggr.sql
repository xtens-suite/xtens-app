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


CREATE OR REPLACE FUNCTION variant_aggregation() RETURNS integer AS $$
  DECLARE
      join_id integer = 0;
      c integer = 0;
      first_ID integer = 0;
      uniq_variant RECORD;
      variant RECORD;
      first BOOLEAN = false;
      v_sql_dynamic varchar(1000) = '';
  BEGIN

      RAISE info 'Start variant_aggregation';

    -- create data_types for every project
      FOR uniq_variant IN SELECT distinct
            d.metadata->'chr'->>'value' as chr,
            d.metadata->'pos'->>'value' as pos,
            d.metadata->'ref'->>'value' as ref,
            d.metadata->'alt'->>'value' as alt FROM data d
            join data_type dt on dt.id = d.type
            join super_type s on dt.super_type =  s.id and s.id = 112
            LOOP

      -- da questa select recupero tutti i dati che cambiano tra le varianti
      v_sql_dynamic := 'SELECT distinct d.id  FROM data d join data_type dt on dt.id = d.type join super_type s on dt.super_type =  s.id and s.id = 112
            where
            metadata @> ''{"chr":{"value":"' || uniq_variant.chr || '" }}'' AND
            metadata @> ''{"pos":{"value":' || uniq_variant.pos || ' }}'' AND
            metadata @> ''{"ref":{"value":"' || uniq_variant.ref || '" }}'' AND
            metadata @> ''{"alt":{"value":"' || uniq_variant.alt || '" }}''';

      --init first
      first := FALSE;
      first_ID := 0;

            FOR variant IN EXECUTE v_sql_dynamic
				lOOP

        IF first = FALSE THEN
          first_ID = variant.id;
          first = TRUE;
          RAISE info 'MASTER Variant %', variant.id;
        ELSE
            -- RAISE info 'Perform update join table id %, master id %', variant.id, first_ID;
            --select id INTO join_id from data_childrendata__data_parentdata where "data_parentData" = variant.id;

            EXECUTE 'UPDATE data_childrendata__data_parentdata SET "data_parentData"=' || quote_literal(first_ID) || ' WHERE "data_parentData" = ' || quote_literal(variant.id);--' WHERE id = ' || quote_literal(join_id);
            execute 'WITH row_deleted AS (delete from data where id =' || quote_literal(variant.id) || 'RETURNING *) SELECT count(*) FROM row_deleted' into c;
            RAISE info 'Deleting Variant %, removed %', variant.id, c;
          END IF;

        --se la prima salvo il suo id e diventa la master
        -- salvarmi da qualche parte le info uniche della variante ( campo supplementare nella join table?) (ora tralascio e perdo le differenze per il pooling)
        -- e sostituisco nella join table l'id della variante master
        -- elimino la variante corrente



            END LOOP;
--finito il ciclo su una variante master rinizializzo a false first e master

      END LOOP;
      RAISE info 'Done creating data parents migration.';
      RETURN 1;
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
