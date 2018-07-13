--
-- XTENS 2 PostgreSQL database updating super type
--
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;


CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET search_path = public, pg_catalog;


CREATE OR REPLACE FUNCTION apply_schema_changes_biobank() RETURNS integer AS $$


  BEGIN

  CREATE TABLE biobank_projects__project_biobanks (
      id integer NOT NULL,
      project_biobanks integer NOT NULL,
      biobank_projects integer NOT NULL
  );

  ALTER TABLE biobank_projects__project_biobanks OWNER TO xtenspg;

  CREATE SEQUENCE biobank_projects__project_biobanks_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;

  ALTER TABLE biobank_projects__project_biobanks_id_seq OWNER TO xtenspg;

  ALTER SEQUENCE biobank_projects__project_biobanks_id_seq OWNED BY biobank_projects__project_biobanks.id;

  ALTER TABLE ONLY biobank_projects__project_biobanks ALTER COLUMN id SET DEFAULT nextval('biobank_projects__project_biobanks_id_seq'::regclass);

  ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT biobank_projects__project_biobanks_key UNIQUE (project_biobanks, biobank_projects);

  ALTER TABLE ONLY biobank_projects__project_biobanks
      ADD CONSTRAINT biobank_projects__project_biobanks_pkey PRIMARY KEY (id);

  ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT project_biobanks_fkey FOREIGN KEY (project_biobanks) REFERENCES project(id) MATCH FULL ON DELETE CASCADE;

  ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT biobank_projects_fkey FOREIGN KEY (biobank_projects) REFERENCES biobank(id) MATCH FULL ON DELETE CASCADE;

  REVOKE ALL ON TABLE biobank_projects__project_biobanks FROM PUBLIC;
  REVOKE ALL ON TABLE biobank_projects__project_biobanks FROM xtenspg;
  GRANT ALL ON TABLE biobank_projects__project_biobanks TO xtenspg;

  REVOKE ALL ON SEQUENCE biobank_projects__project_biobanks_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE biobank_projects__project_biobanks_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE biobank_projects__project_biobanks_id_seq TO xtenspg;


ALTER TABLE data_type ADD COLUMN biobank_prefix text;
ALTER TABLE data_type ADD COLUMN parent_no_prefix boolean;
ALTER TABLE data_type ADD COLUMN parent_code boolean; -- SET DEFAULT FALSE NOT NULL;

UPDATE data_type set parent_no_prefix=FALSE, parent_code=FALSE; -- SET DEFAULT FALSE NOT NULL;

ALTER TABLE data_type alter COLUMN parent_no_prefix SET DEFAULT FALSE;
ALTER TABLE data_type alter COLUMN parent_no_prefix SET NOT NULL;

ALTER TABLE data_type alter COLUMN parent_code SET DEFAULT FALSE;
ALTER TABLE data_type alter COLUMN parent_code SET NOT NULL;



  RETURN 1;
  END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION datatype_settings() RETURNS integer AS $$
  DECLARE
      datatype RECORD;
      id INTEGER;
      prefixcode text;
      parentcode boolean;
      nocodeifparent boolean;
  BEGIN

      RAISE info 'Start datatype_settings';

    -- create address for every operator
      FOR datatype IN SELECT * FROM data_type WHERE model = 'Sample' ORDER BY id LOOP

        id := datatype.id;
        IF datatype.project = 1 OR datatype.project = 5 OR datatype.project = 3 THEN

            IF datatype.name = 'Tissue' THEN
            prefixcode := '00';
            parentcode := FALSE;
            nocodeifparent := TRUE;
            ELSIF datatype.name = 'Fluid' THEN
            prefixcode := '03';
            parentcode := TRUE;
            nocodeifparent := TRUE;
            ELSIF datatype.name = 'DNA' THEN
            prefixcode := '02';
            parentcode := TRUE;
            nocodeifparent := FALSE;
            ELSIF datatype.name = 'RNA' THEN
            prefixcode := '01';
            parentcode := TRUE;
            nocodeifparent := FALSE;
            END IF;

        ELSIF datatype.project = 6 THEN
          IF datatype.name = 'Blood' THEN
          prefixcode := 'GS_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          ELSIF datatype.name = 'Plasma' THEN
          prefixcode := 'GSP_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          ELSIF datatype.name = 'Pbmc' THEN
          prefixcode := 'GSC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          ELSIF datatype.name = 'Urine' THEN
          prefixcode := 'GSU_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          ELSIF datatype.name = 'Serum' THEN
          prefixcode := 'GSS_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          ELSIF datatype.name = 'DNA' THEN
          prefixcode := ' GSD_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;

        ELSIF datatype.project = 8 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'GC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;

        ELSIF datatype.project = 9 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'AP_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 10 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 11 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 12 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 13 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 14 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 15 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 16 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 17 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 18 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 19 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'IC_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 20 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 21 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 22 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 23 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 24 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 25 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        ELSIF datatype.project = 26 THEN
          IF datatype.name = 'Tissue' THEN
          prefixcode := 'FZ_';
          parentcode := FALSE;
          nocodeifparent := FALSE;
          END IF;
        END IF;

        EXECUTE 'UPDATE data_type SET biobank_prefix =' || quote_literal(prefixcode) || ', parent_code =' || quote_literal(parentcode) || ', parent_no_prefix =' || quote_literal(nocodeifparent) || 'WHERE id = ' || quote_literal(id);
      END LOOP;

      RAISE info 'Done datatype_settings';
      RETURN 1;
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION glyco_sample_migration() RETURNS integer AS $$
  DECLARE
      sample RECORD;
      id INTEGER;
      typec INTEGER;
  BEGIN

      RAISE info 'Start glyco_sample_migration';

    -- create address for every operator
      FOR sample IN SELECT * FROM sample WHERE type = 109 ORDER BY id LOOP

        id := sample.id;

        IF strpos(sample.biobank_code, 'GS_') > 0 THEN
          typec := 187;
        ELSIF strpos(sample.biobank_code, 'GSP_') > 0 THEN
          typec := 188;
        ELSIF strpos(sample.biobank_code, 'GSC_') > 0 THEN
          typec := 189;
        ELSIF strpos(sample.biobank_code, 'GSU_') > 0 THEN
          typec := 190;
        ELSIF strpos(sample.biobank_code, 'GSS_') > 0 THEN
          typec := 191;
        END IF;

        EXECUTE 'UPDATE sample SET type =' || quote_literal(typec) || ' WHERE id = ' || quote_literal(id);

        RAISE info 'Updated sample %', sample.id;

      END LOOP;

      RAISE info 'Done glyco_sample_migration';
      RETURN 1;
  END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION main_migration_owner( id_owner int default 0) RETURNS integer AS $$

  BEGIN
    -- PERFORM apply_schema_changes_biobank();
    PERFORM datatype_settings();
    PERFORM glyco_sample_migration();


    -- DROP created functions
    -- DROP FUNCTION apply_schema_changes_biobank();
    DROP FUNCTION datatype_settings();
    DROP FUNCTION glyco_sample_migration();
    RETURN 1;
  END;
$$ LANGUAGE plpgsql;


SELECT * FROM main_migration_owner();
