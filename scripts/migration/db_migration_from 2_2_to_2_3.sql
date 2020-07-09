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


CREATE OR REPLACE FUNCTION main_migration_owner( id_owner int default 0) RETURNS integer AS $$

  BEGIN
    PERFORM apply_schema_changes_biobank();

    -- DROP created functions
    DROP FUNCTION apply_schema_changes_biobank();

    RETURN 1;
  END;
$$ LANGUAGE plpgsql;


SELECT * FROM main_migration_owner();
