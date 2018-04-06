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



CREATE OR REPLACE FUNCTION apply_schema_changes() RETURNS integer AS $$


  BEGIN
  -- MANY SUBJECT - MANY DATA
  -- Name: data_parentsubject__subject_datachildren; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE data_parentsubject__subject_datachildren (
      id integer NOT NULL,
      data_parents integer NOT NULL,
      subject_children integer NOT NULL
  );


  ALTER TABLE data_parentsubject__subject_datachildren OWNER TO xtenspg;

  --
  -- Name: data_parentsubject__subject_datachildren_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE data_parentsubject__subject_datachildren_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE data_parentsubject__subject_datachildren_id_seq OWNER TO xtenspg;

  --
  -- Name: data_parentsubject__subject_datachildren_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE data_parentsubject__subject_datachildren_id_seq OWNED BY data_parentsubject__subject_datachildren.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsubject__subject_datachildren ALTER COLUMN id SET DEFAULT nextval('data_parentsubject__subject_datachildren_id_seq'::regclass);

  --
  -- Name: data_parentsubject__subject_datachildren_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsubject__subject_datachildren
      ADD CONSTRAINT data_parentsubject__subject_datachildren_key UNIQUE (data_parents, subject_children);


  --
  -- Name: data_parentsubject__subject_datachildren_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsubject__subject_datachildren
      ADD CONSTRAINT data_parentsubject__subject_datachildren_pkey PRIMARY KEY (id);

  --
  -- Name: data_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsubject__subject_datachildren
      ADD CONSTRAINT data_parents_fkey FOREIGN KEY (data_parents) REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: subject_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsubject__subject_datachildren
      ADD CONSTRAINT subject_children_fkey FOREIGN KEY (subject_children) REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_parentsubject__subject_datachildren; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE data_parentsubject__subject_datachildren FROM PUBLIC;
  REVOKE ALL ON TABLE data_parentsubject__subject_datachildren FROM xtenspg;
  GRANT ALL ON TABLE data_parentsubject__subject_datachildren TO xtenspg;

  --
  -- Name: data_parentsubject__subject_datachildren_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE data_parentsubject__subject_datachildren_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE data_parentsubject__subject_datachildren_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE data_parentsubject__subject_datachildren_id_seq TO xtenspg;


  -- MANY SUBJECT - MANY SAMPLE
  -- Name: sample_parentsubject__subject_samplechildren; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE sample_parentsubject__subject_samplechildren (
      id integer NOT NULL,
      sample_parents integer NOT NULL,
      subject_children integer NOT NULL
  );


  ALTER TABLE sample_parentsubject__subject_samplechildren OWNER TO xtenspg;

  --
  -- Name: sample_parentsubject__subject_samplechildren_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE sample_parentsubject__subject_samplechildren_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE sample_parentsubject__subject_samplechildren_id_seq OWNER TO xtenspg;

  --
  -- Name: sample_parentsubject__subject_samplechildren_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE sample_parentsubject__subject_samplechildren_id_seq OWNED BY sample_parentsubject__subject_samplechildren.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsubject__subject_samplechildren ALTER COLUMN id SET DEFAULT nextval('sample_parentsubject__subject_samplechildren_id_seq'::regclass);

  --
  -- Name: sample_parentsubject__subject_samplechildren_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_parentsubject__subject_samplechildren
      ADD CONSTRAINT sample_parentsubject__subject_samplechildren_key UNIQUE (sample_parents, subject_children);


  --
  -- Name: sample_parentsubject__subject_samplechildren_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_parentsubject__subject_samplechildren
      ADD CONSTRAINT sample_parentsubject__subject_samplechildren_pkey PRIMARY KEY (id);

  --
  -- Name: sample_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsubject__subject_samplechildren
      ADD CONSTRAINT sample_parents_fkey FOREIGN KEY (sample_parents) REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: subject_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsubject__subject_samplechildren
      ADD CONSTRAINT subject_children_fkey FOREIGN KEY (subject_children) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_parentsubject__subject_samplechildren; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE sample_parentsubject__subject_samplechildren FROM PUBLIC;
  REVOKE ALL ON TABLE sample_parentsubject__subject_samplechildren FROM xtenspg;
  GRANT ALL ON TABLE sample_parentsubject__subject_samplechildren TO xtenspg;

  --
  -- Name: sample_parentsubject__subject_samplechildren_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE sample_parentsubject__subject_samplechildren_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE sample_parentsubject__subject_samplechildren_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE sample_parentsubject__subject_samplechildren_id_seq TO xtenspg;


  -- MANY SAMPLE - MANY SAMPLE
  -- Name: sample_parentsample__sample_samplechildren; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE sample_parentsample__sample_samplechildren (
      id integer NOT NULL,
      sample_parents integer NOT NULL,
      sample_children integer NOT NULL
  );


  ALTER TABLE sample_parentsample__sample_samplechildren OWNER TO xtenspg;

  --
  -- Name: sample_parentsample__sample_samplechildren_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE sample_parentsample__sample_samplechildren_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE sample_parentsample__sample_samplechildren_id_seq OWNER TO xtenspg;

  --
  -- Name: sample_parentsample__sample_samplechildren_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE sample_parentsample__sample_samplechildren_id_seq OWNED BY sample_parentsample__sample_samplechildren.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsample__sample_samplechildren ALTER COLUMN id SET DEFAULT nextval('sample_parentsample__sample_samplechildren_id_seq'::regclass);

  --
  -- Name: sample_parentsample__sample_samplechildren_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_parentsample__sample_samplechildren
      ADD CONSTRAINT sample_parentsample__sample_samplechildren_key UNIQUE (sample_parents, sample_children);


  --
  -- Name: sample_parentsample__sample_samplechildren_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_parentsample__sample_samplechildren
      ADD CONSTRAINT sample_parentsample__sample_samplechildren_pkey PRIMARY KEY (id);

  --
  -- Name: sample_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsample__sample_samplechildren
      ADD CONSTRAINT sample_parents_fkey FOREIGN KEY (sample_parents) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsample__sample_samplechildren
      ADD CONSTRAINT sample_children_fkey FOREIGN KEY (sample_children) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_parentsample__sample_samplechildren; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE sample_parentsample__sample_samplechildren FROM PUBLIC;
  REVOKE ALL ON TABLE sample_parentsample__sample_samplechildren FROM xtenspg;
  GRANT ALL ON TABLE sample_parentsample__sample_samplechildren TO xtenspg;

  --
  -- Name: sample_parentsample__sample_samplechildren_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE sample_parentsample__sample_samplechildren_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE sample_parentsample__sample_samplechildren_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE sample_parentsample__sample_samplechildren_id_seq TO xtenspg;




  -- MANY DATA - MANY DATA
  -- Name: data_parentdata__data_datachildren; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE data_parentdata__data_datachildren (
      id integer NOT NULL,
      data_parents integer NOT NULL,
      data_children integer NOT NULL
  );


  ALTER TABLE data_parentdata__data_datachildren OWNER TO xtenspg;

  --
  -- Name: data_parentdata__data_datachildren_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE data_parentdata__data_datachildren_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE data_parentdata__data_datachildren_id_seq OWNER TO xtenspg;

  --
  -- Name: data_parentdata__data_datachildren_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE data_parentdata__data_datachildren_id_seq OWNED BY data_parentdata__data_datachildren.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentdata__data_datachildren ALTER COLUMN id SET DEFAULT nextval('data_parentdata__data_datachildren_id_seq'::regclass);

  --
  -- Name: data_parentdata__data_datachildren_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentdata__data_datachildren
      ADD CONSTRAINT data_parentdata__data_datachildren_key UNIQUE (data_parents, data_children);


  --
  -- Name: data_parentdata__data_datachildren_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentdata__data_datachildren
      ADD CONSTRAINT data_parentdata__data_datachildren_pkey PRIMARY KEY (id);

  --
  -- Name: data_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentdata__data_datachildren
      ADD CONSTRAINT data_parents_fkey FOREIGN KEY (data_parents) REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentdata__data_datachildren
      ADD CONSTRAINT data_children_fkey FOREIGN KEY (data_children) REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_parentdata__data_datachildren; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE data_parentdata__data_datachildren FROM PUBLIC;
  REVOKE ALL ON TABLE data_parentdata__data_datachildren FROM xtenspg;
  GRANT ALL ON TABLE data_parentdata__data_datachildren TO xtenspg;

  --
  -- Name: data_parentdata__data_datachildren_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE data_parentdata__data_datachildren_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE data_parentdata__data_datachildren_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE data_parentdata__data_datachildren_id_seq TO xtenspg;


  -- MANY SAMPLE - MANY DATA
  -- Name: data_parentsample__sample_datachildren; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE data_parentsample__sample_datachildren (
      id integer NOT NULL,
      data_parents integer NOT NULL,
      sample_children integer NOT NULL
  );


  ALTER TABLE data_parentsample__sample_datachildren OWNER TO xtenspg;

  --
  -- Name: data_parentsample__sample_datachildren_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE data_parentsample__sample_datachildren_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE data_parentsample__sample_datachildren_id_seq OWNER TO xtenspg;

  --
  -- Name: data_parentsample__sample_datachildren_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE data_parentsample__sample_datachildren_id_seq OWNED BY data_parentsample__sample_datachildren.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsample__sample_datachildren ALTER COLUMN id SET DEFAULT nextval('data_parentsample__sample_datachildren_id_seq'::regclass);

  --
  -- Name: data_parentsample__sample_datachildren_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsample__sample_datachildren
      ADD CONSTRAINT data_parentsample__sample_datachildren_key UNIQUE (data_parents, sample_children);


  --
  -- Name: data_parentsample__sample_datachildren_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsample__sample_datachildren
      ADD CONSTRAINT data_parentsample__sample_datachildren_pkey PRIMARY KEY (id);

  --
  -- Name: data_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsample__sample_datachildren
      ADD CONSTRAINT data_parents_fkey FOREIGN KEY (data_parents) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsample__sample_datachildren
      ADD CONSTRAINT sample_children_fkey FOREIGN KEY (sample_children) REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_parentsample__sample_datachildren; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE data_parentsample__sample_datachildren FROM PUBLIC;
  REVOKE ALL ON TABLE data_parentsample__sample_datachildren FROM xtenspg;
  GRANT ALL ON TABLE data_parentsample__sample_datachildren TO xtenspg;

  --
  -- Name: data_parentsample__sample_datachildren_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE data_parentsample__sample_datachildren_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE data_parentsample__sample_datachildren_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE data_parentsample__sample_datachildren_id_seq TO xtenspg;

  RETURN 1;
  END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION data_parents_migration() RETURNS integer AS $$
  DECLARE
      data RECORD;
  BEGIN

      RAISE info 'Start migration data - parents';

    -- create data_types for every project
      FOR data IN SELECT * FROM data ORDER BY id LOOP

          --RAISE info 'data id %, data parent_subject %, data parent_sample %, data parent_data %', data.id, data.parent_subject, data.parent_sample, data.parent_data;

          IF data.parent_subject IS NOT NULL THEN
              RAISE info 'data parent_subject %', data.parent_subject;
              EXECUTE 'INSERT INTO data_parentsubject__subject_datachildren (data_parents, subject_children)  VALUES (' || quote_literal(data.parent_subject) || ', ' || quote_literal(data.id) ||  ')';

          ELSE
              RAISE info 'data parent_subject is NULL';
          END IF;

          IF data.parent_sample IS NOT NULL THEN
              RAISE info 'data parent_sample %', data.parent_sample;
              EXECUTE 'INSERT INTO data_parentsample__sample_datachildren (data_parents, sample_children)  VALUES (' || quote_literal(data.parent_sample) || ', ' || quote_literal(data.id) ||  ')';

          ELSE
              RAISE info 'data parent_sample is NULL';
          END IF;

          IF data.parent_data IS NOT NULL THEN
              RAISE info 'data parent_data %', data.parent_data;
              EXECUTE 'INSERT INTO data_parentdata__data_datachildren (data_parents, data_children)  VALUES (' || quote_literal(data.parent_data) || ', ' || quote_literal(data.id) ||  ')';

          ELSE
              RAISE info 'data parent_data is NULL';
          END IF;

      END LOOP;

      RAISE info 'Done creating data parents migration.';
      RETURN 1;
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sample_parents_migration() RETURNS integer AS $$
  DECLARE
      sample RECORD;
  BEGIN

      RAISE info 'Start migration sample - parents';

    -- create data_types for every project
      FOR sample IN SELECT * FROM sample ORDER BY id LOOP

          --RAISE info 'data id %, data parent_subject %, data parent_sample %, data parent_data %', data.id, data.parent_subject, data.parent_sample, data.parent_data;

          IF sample.parent_subject IS NOT NULL THEN
              RAISE info 'sample parent_subject %', sample.parent_subject;
              EXECUTE 'INSERT INTO sample_parentsubject__subject_samplechildren (sample_parents, subject_children)  VALUES (' || quote_literal(sample.parent_subject) || ', ' || quote_literal(sample.id) ||  ')';

          ELSE
              RAISE info 'data parent_subject is NULL';
          END IF;

          IF sample.parent_sample IS NOT NULL THEN
              RAISE info 'sample parent_sample %', sample.parent_sample;
              EXECUTE 'INSERT INTO sample_parentsample__sample_samplechildren (sample_parents, sample_children)  VALUES (' || quote_literal(sample.parent_sample) || ', ' || quote_literal(sample.id) ||  ')';

          ELSE
              RAISE info 'sample parent_sample is NULL';
          END IF;

      END LOOP;

      RAISE info 'Done creating data parents migration.';
      RETURN 1;
  END;
$$ LANGUAGE plpgsql;


-- CREATE OR REPLACE FUNCTION set_subjects_samples_data_type(default_project int) RETURNS integer AS $$
--   DECLARE
--       datum RECORD;
--       subj RECORD;
--       dt_source_name varchar;
--       data_type_dest integer;
--
--   BEGIN
--
--       RAISE info 'Starting set_subjects_samples_data_type()';
--
--       FOR subj IN SELECT s.id, project_subjects, dt.name AS type  FROM subject s INNER JOIN project_subjects__subject_projects AS ps ON (s.id = ps.subject_projects) INNER JOIN data_type dt ON s.type = dt.id ORDER BY s.id LOOP
--
--         IF subj.project_subjects <> default_project THEN
--           RAISE info 'subject %, for project %', subj.id, subj.project_subjects;
--         --
--           SELECT id INTO data_type_dest FROM data_type WHERE name = subj.type AND project = subj.project_subjects;
--
--           EXECUTE 'UPDATE subject SET type =' || quote_literal(data_type_dest) || ' WHERE id = ' || quote_literal(subj.id) ;
--
--           FOR datum IN  SELECT s.id AS id , dt.name AS type, dt.model AS model FROM sample s INNER JOIN data_type dt ON s.type = dt.id WHERE s.parent_subject = subj.id
--                         UNION ALL
--                         SELECT d.id AS id, dt.name AS type, dt.model AS model FROM data d INNER JOIN data_type dt ON d.type = dt.id WHERE d.parent_subject = subj.id  LIMIT 100 LOOP
--
--
--             SELECT id INTO data_type_dest FROM data_type WHERE name = datum.type AND project = subj.project_subjects;
--
--             EXECUTE 'UPDATE ' || lower(datum.model) || ' SET type =' || quote_literal(data_type_dest) || ' WHERE id = ' || quote_literal(datum.id) ;
--
--           END LOOP;
--
--         END IF;
--
--       END LOOP;
--
--       RAISE info 'Done set_subjects_samples_data_type()';
--       RETURN 1;
--   END;
-- $$ LANGUAGE plpgsql;
--
--
-- CREATE OR REPLACE FUNCTION groups_projects_associations(default_project int default 0) RETURNS integer AS $$
--   DECLARE
--       xt_group RECORD;
--       project integer;
--   BEGIN
--
--       RAISE info 'Start creating groups_projects_associations()';
--
--       IF default_project <> 0 THEN
--
--         FOR xt_group IN SELECT * FROM xtens_group ORDER BY id LOOP
--
--             RAISE info 'group %, level %', xt_group.id, xt_group.privilege_level;
--
--             IF xt_group.privilege_level = 'wheel' THEN
--               FOR project IN SELECT id FROM project ORDER BY id LOOP
--                   EXECUTE 'INSERT INTO group_projects__project_groups (project_groups, group_projects) VALUES (' || quote_literal(project) || ', '  || quote_literal(xt_group.id) ||  ')';
--               END LOOP;
--
--             ELSE
--               EXECUTE 'INSERT INTO group_projects__project_groups (project_groups, group_projects) VALUES (' || quote_literal(default_project) || ', '  || quote_literal(xt_group.id) ||  ')';
--
--             END IF;
--
--         END LOOP;
--
--       END IF;
--       RAISE info 'Done groups_projects_associations().';
--       RETURN 1;
--   END;
-- $$ LANGUAGE plpgsql;
--
--
-- CREATE OR REPLACE FUNCTION wheel_groups_data_types_privileges_associations() RETURNS integer AS $$
--   DECLARE
--       xt_group integer;
--       data_type integer;
--   BEGIN
--
--       RAISE info 'Start creating wheel_groups_data_types_privileges_associations()';
--
--       -- IF default_project <> 0 THEN
--
--         FOR xt_group IN SELECT id FROM xtens_group WHERE privilege_level = 'wheel' ORDER BY id LOOP
--           FOR data_type IN SELECT id FROM data_type ORDER BY id LOOP
--
--             EXECUTE 'INSERT INTO datatype_groups__group_datatypes (datatype_groups,' ||  quote_ident('group_dataTypes') || ')  VALUES (' || quote_literal(data_type) || ', ' || quote_literal(xt_group) ||  ') ON CONFLICT("datatype_groups", "group_dataTypes") DO NOTHING';
--
--             EXECUTE 'INSERT INTO datatype_privileges (data_type, xtens_group, privilege_level) VALUES (' || quote_literal(data_type) || ', ' || quote_literal(xt_group) || ', ' || quote_literal('edit') || ') ON CONFLICT("data_type", "xtens_group") DO NOTHING';
--
--           END LOOP;
--         END LOOP;
--
--       -- END IF;
--       RAISE info 'Done wheel_groups_data_types_privileges_associations().';
--       RETURN 1;
--   END;
-- $$ LANGUAGE plpgsql;
--
--
-- CREATE OR REPLACE FUNCTION clean_data_types(default_project int default 0) RETURNS integer AS $$
--   DECLARE
--       data RECORD;
--   BEGIN
--
--       RAISE info 'Start creating clean_data_types()';
--
--
--       FOR data IN SELECT COUNT(b) > 0 as has_data, id_type as type  FROM (SELECT sb.id as b, dt.id as id_type FROM subject sb RIGHT OUTER JOIN data_type dt ON dt.id = sb.type WHERE dt.model = 'Subject' AND dt.project <> default_project
--         UNION ALL
--         SELECT s.id as b, dt.id as id_type  FROM sample s RIGHT OUTER JOIN data_type dt ON dt.id = s.type WHERE dt.model = 'Sample' AND dt.project <> default_project
--         UNION ALL
--         SELECT d.id as b, dt.id  as id_type FROM data d RIGHT OUTER JOIN data_type dt ON dt.id = d.type WHERE dt.model = 'Data' AND dt.project <> default_project) ss GROUP BY type ORDER BY type LOOP
--
--           IF data.has_data IS FALSE THEN
--
--           RAISE info 'PERFORM clean_data_types() on data_type %', data;
--
--               EXECUTE 'DELETE FROM data_type WHERE id = ' || data.type  ;
--
--           END IF;
--
--
--         END LOOP;
--
--       RAISE info 'Done clean_data_types().';
--       RETURN 1;
--   END;
-- $$ LANGUAGE plpgsql;
--
--
-- CREATE OR REPLACE FUNCTION clean_db_schema() RETURNS integer AS $$
--
--   BEGIN
--
--     --
--     -- Name: project_subjects__subject_projects_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--     --
--
--     DROP SEQUENCE project_subjects__subject_projects_id_seq CASCADE;
--
--     --
--     -- Name: project_subjects__subject_projects; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--     --
--
--     DROP TABLE project_subjects__subject_projects;
--
--     RETURN 1;
--   END;
-- $$ LANGUAGE plpgsql;
DROP FUNCTION main_migration(int);

CREATE OR REPLACE FUNCTION main_migration() RETURNS integer AS $$

  BEGIN
    -- PERFORM apply_schema_changes();
    -- PERFORM data_parents_migration();
    PERFORM sample_parents_migration();
    -- ALTER TABLE data_type ALTER COLUMN project SET NOT NULL;
    -- PERFORM dt_creation( default_project );
    -- PERFORM set_subjects_samples_data_type( default_project );
    -- PERFORM clean_data_types( default_project );
    -- PERFORM groups_projects_associations( default_project );
    -- PERFORM wheel_groups_data_types_privileges_associations();
    -- PERFORM clean_db_schema();


    -- DROP created functions
    -- DROP FUNCTION apply_schema_changes();
    -- DROP FUNCTION data_parents_migration();
    DROP FUNCTION sample_parents_migration();
    -- DROP FUNCTION dt_creation(int);
    -- DROP FUNCTION set_subjects_samples_data_type(int);
    -- DROP FUNCTION clean_data_types(int);
    -- DROP FUNCTION groups_projects_associations(int);
    -- DROP FUNCTION wheel_groups_data_types_privileges_associations();
    -- DROP FUNCTION clean_db_schema();
    RETURN 1;
  END;
$$ LANGUAGE plpgsql;


SELECT * FROM main_migration();-- set the id of default project
