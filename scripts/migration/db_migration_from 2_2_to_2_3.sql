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

  -- Name: data_parentsubject__subject_childrendata; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE data_parentsubject__subject_childrendata (
      id integer NOT NULL,
      "data_parentSubject" integer NOT NULL,
      "subject_childrenData" integer NOT NULL
  );


  ALTER TABLE data_parentsubject__subject_childrendata OWNER TO xtenspg;

  --
  -- Name: data_parentsubject__subject_childrendata_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE data_parentsubject__subject_childrendata_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE data_parentsubject__subject_childrendata_id_seq OWNER TO xtenspg;

  --
  -- Name: data_parentsubject__subject_childrendata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE data_parentsubject__subject_childrendata_id_seq OWNED BY data_parentsubject__subject_childrendata.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsubject__subject_childrendata ALTER COLUMN id SET DEFAULT nextval('data_parentsubject__subject_childrendata_id_seq'::regclass);

  --
  -- Name: data_parentsubject__subject_childrendata_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsubject__subject_childrendata
      ADD CONSTRAINT data_parentsubject__subject_childrendata_key UNIQUE ("data_parentSubject", "subject_childrenData");


  --
  -- Name: data_parentsubject__subject_childrendata_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsubject__subject_childrendata
      ADD CONSTRAINT data_parentsubject__subject_childrendata_pkey PRIMARY KEY (id);

  --
  -- Name: data_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsubject__subject_childrendata
      ADD CONSTRAINT data_parents_fkey FOREIGN KEY ("data_parentSubject") REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: subject_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsubject__subject_childrendata
      ADD CONSTRAINT subject_children_fkey FOREIGN KEY ("subject_childrenData") REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_parentsubject__subject_childrendata; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE data_parentsubject__subject_childrendata FROM PUBLIC;
  REVOKE ALL ON TABLE data_parentsubject__subject_childrendata FROM xtenspg;
  GRANT ALL ON TABLE data_parentsubject__subject_childrendata TO xtenspg;

  --
  -- Name: data_parentsubject__subject_childrendata_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE data_parentsubject__subject_childrendata_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE data_parentsubject__subject_childrendata_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE data_parentsubject__subject_childrendata_id_seq TO xtenspg;



  -- MANY SUBJECT - MANY SAMPLE

  -- Name: sample_donor__subject_childrensample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE sample_donor__subject_childrensample (
      id integer NOT NULL,
      sample_donor integer NOT NULL,
      "subject_childrenSample" integer NOT NULL
  );


  ALTER TABLE sample_donor__subject_childrensample OWNER TO xtenspg;

  --
  -- Name: sample_donor__subject_childrensample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE sample_donor__subject_childrensample_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE sample_donor__subject_childrensample_id_seq OWNER TO xtenspg;

  --
  -- Name: sample_donor__subject_childrensample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE sample_donor__subject_childrensample_id_seq OWNED BY sample_donor__subject_childrensample.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_donor__subject_childrensample ALTER COLUMN id SET DEFAULT nextval('sample_donor__subject_childrensample_id_seq'::regclass);

  --
  -- Name: sample_donor__subject_childrensample_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_donor__subject_childrensample
      ADD CONSTRAINT sample_donor__subject_childrensample_key UNIQUE (sample_donor, "subject_childrenSample");


  --
  -- Name: sample_donor__subject_childrensample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_donor__subject_childrensample
      ADD CONSTRAINT sample_donor__subject_childrensample_pkey PRIMARY KEY (id);

  --
  -- Name: sample_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_donor__subject_childrensample
      ADD CONSTRAINT sample_parents_fkey FOREIGN KEY (sample_donor) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: subject_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_donor__subject_childrensample
      ADD CONSTRAINT subject_children_fkey FOREIGN KEY ("subject_childrenSample") REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_donor__subject_childrensample; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE sample_donor__subject_childrensample FROM PUBLIC;
  REVOKE ALL ON TABLE sample_donor__subject_childrensample FROM xtenspg;
  GRANT ALL ON TABLE sample_donor__subject_childrensample TO xtenspg;

  --
  -- Name: sample_donor__subject_childrensample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE sample_donor__subject_childrensample_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE sample_donor__subject_childrensample_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE sample_donor__subject_childrensample_id_seq TO xtenspg;



  -- MANY SAMPLE - MANY SAMPLE

  -- Name: sample_parentsample__sample_childrensample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE sample_parentsample__sample_childrensample (
      id integer NOT NULL,
      "sample_parentSample" integer NOT NULL,
      "sample_childrenSample" integer NOT NULL
  );


  ALTER TABLE sample_parentsample__sample_childrensample OWNER TO xtenspg;

  --
  -- Name: sample_parentsample__sample_childrensample; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE sample_parentsample__sample_childrensample_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE sample_parentsample__sample_childrensample_id_seq OWNER TO xtenspg;

  --
  -- Name: sample_parentsample__sample_childrensample; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE sample_parentsample__sample_childrensample_id_seq OWNED BY sample_parentsample__sample_childrensample.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsample__sample_childrensample ALTER COLUMN id SET DEFAULT nextval('sample_parentsample__sample_childrensample_id_seq'::regclass);

  --
  -- Name: sample_parentsample__sample_childrensample_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_parentsample__sample_childrensample
      ADD CONSTRAINT sample_parentsample__sample_childrensample_key UNIQUE ("sample_parentSample", "sample_childrenSample");


  --
  -- Name: sample_parentsample__sample_childrensample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY sample_parentsample__sample_childrensample
      ADD CONSTRAINT sample_parentsample__sample_childrensample_pkey PRIMARY KEY (id);

  --
  -- Name: sample_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsample__sample_childrensample
      ADD CONSTRAINT sample_parents_fkey FOREIGN KEY ("sample_parentSample") REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY sample_parentsample__sample_childrensample
      ADD CONSTRAINT sample_children_fkey FOREIGN KEY ("sample_childrenSample") REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_parentsample__sample_childrensample; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE sample_parentsample__sample_childrensample FROM PUBLIC;
  REVOKE ALL ON TABLE sample_parentsample__sample_childrensample FROM xtenspg;
  GRANT ALL ON TABLE sample_parentsample__sample_childrensample TO xtenspg;

  --
  -- Name: sample_parentsample__sample_childrensample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE sample_parentsample__sample_childrensample_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE sample_parentsample__sample_childrensample_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE sample_parentsample__sample_childrensample_id_seq TO xtenspg;



  -- MANY DATA - MANY DATA


  -- Name: data_childrendata__data_parentdata; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE data_childrendata__data_parentdata (
      id integer NOT NULL,
      "data_parentData" integer NOT NULL,
      "data_childrenData" integer NOT NULL
  );


  ALTER TABLE data_childrendata__data_parentdata OWNER TO xtenspg;

  --
  -- Name: data_childrendata__data_parentdata_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE data_childrendata__data_parentdata_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE data_childrendata__data_parentdata_id_seq OWNER TO xtenspg;

  --
  -- Name: data_childrendata__data_parentdata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE data_childrendata__data_parentdata_id_seq OWNED BY data_childrendata__data_parentdata.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_childrendata__data_parentdata ALTER COLUMN id SET DEFAULT nextval('data_childrendata__data_parentdata_id_seq'::regclass);

  --
  -- Name: data_childrendata__data_parentdata_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_childrendata__data_parentdata
      ADD CONSTRAINT data_childrendata__data_parentdata_key UNIQUE ("data_parentData", "data_childrenData");


  --
  -- Name: data_childrendata__data_parentdata_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_childrendata__data_parentdata
      ADD CONSTRAINT data_childrendata__data_parentdata_pkey PRIMARY KEY (id);

  --
  -- Name: data_parentsData_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_childrendata__data_parentdata
      ADD CONSTRAINT data_parentsData_fkey FOREIGN KEY ("data_parentData") REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_childrendata__data_parentdata
      ADD CONSTRAINT data_children_fkey FOREIGN KEY ("data_childrenData") REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_childrendata__data_parentdata; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE data_childrendata__data_parentdata FROM PUBLIC;
  REVOKE ALL ON TABLE data_childrendata__data_parentdata FROM xtenspg;
  GRANT ALL ON TABLE data_childrendata__data_parentdata TO xtenspg;

  --
  -- Name: data_childrendata__data_parentdata_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE data_childrendata__data_parentdata_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE data_childrendata__data_parentdata_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE data_childrendata__data_parentdata_id_seq TO xtenspg;



  -- MANY SAMPLE - MANY DATA


  -- Name: data_parentsample__sample_childrendata; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
  --

  CREATE TABLE data_parentsample__sample_childrendata (
      id integer NOT NULL,
      "data_parentSample" integer NOT NULL,
      "sample_childrenData" integer NOT NULL
  );


  ALTER TABLE data_parentsample__sample_childrendata OWNER TO xtenspg;

  --
  -- Name: data_parentsample__sample_childrendata_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
  --

  CREATE SEQUENCE data_parentsample__sample_childrendata_id_seq
      START WITH 1
      INCREMENT BY 1
      NO MINVALUE
      NO MAXVALUE
      CACHE 1;


  ALTER TABLE data_parentsample__sample_childrendata_id_seq OWNER TO xtenspg;

  --
  -- Name: data_parentsample__sample_childrendata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
  --

  ALTER SEQUENCE data_parentsample__sample_childrendata_id_seq OWNED BY data_parentsample__sample_childrendata.id;

  --
  -- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsample__sample_childrendata ALTER COLUMN id SET DEFAULT nextval('data_parentsample__sample_childrendata_id_seq'::regclass);

  --
  -- Name: data_parentsample__sample_childrendata_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsample__sample_childrendata
      ADD CONSTRAINT data_parentsample__sample_childrendata_key UNIQUE ("data_parentSample", "sample_childrenData");


  --
  -- Name: data_parentsample__sample_childrendata_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
  --

  ALTER TABLE ONLY data_parentsample__sample_childrendata
      ADD CONSTRAINT data_parentsample__sample_childrendata_pkey PRIMARY KEY (id);

  --
  -- Name: data_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsample__sample_childrendata
      ADD CONSTRAINT data_parents_fkey FOREIGN KEY ("data_parentSample") REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: sample_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
  --

  ALTER TABLE ONLY data_parentsample__sample_childrendata
      ADD CONSTRAINT sample_children_fkey FOREIGN KEY ("sample_childrenData") REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;

  --
  -- Name: data_parentsample__sample_childrendata; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON TABLE data_parentsample__sample_childrendata FROM PUBLIC;
  REVOKE ALL ON TABLE data_parentsample__sample_childrendata FROM xtenspg;
  GRANT ALL ON TABLE data_parentsample__sample_childrendata TO xtenspg;

  --
  -- Name: data_parentsample__sample_childrendata_id_seq; Type: ACL; Schema: public; Owner: xtenspg
  --

  REVOKE ALL ON SEQUENCE data_parentsample__sample_childrendata_id_seq FROM PUBLIC;
  REVOKE ALL ON SEQUENCE data_parentsample__sample_childrendata_id_seq FROM xtenspg;
  GRANT ALL ON SEQUENCE data_parentsample__sample_childrendata_id_seq TO xtenspg;

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
              EXECUTE 'INSERT INTO data_parentsubject__subject_childrendata (' || quote_ident('data_parentSubject') || ', '|| quote_ident('subject_childrenData') || ')  VALUES (' || quote_literal(data.id) || ', ' || quote_literal(data.parent_subject) ||  ')';

          ELSE
              RAISE info 'data parent_subject is NULL';
          END IF;

          IF data.parent_sample IS NOT NULL THEN
              RAISE info 'data parent_sample %', data.parent_sample;
              EXECUTE 'INSERT INTO data_parentsample__sample_childrendata (' || quote_ident('data_parentSample') || ', '|| quote_ident('sample_childrenData') || ')  VALUES (' || quote_literal(data.id) || ', ' || quote_literal(data.parent_sample) ||  ')';

          ELSE
              RAISE info 'data parent_sample is NULL';
          END IF;

          IF data.parent_data IS NOT NULL THEN
              RAISE info 'data parent_data %', data.parent_data;
              EXECUTE 'INSERT INTO data_childrendata__data_parentdata (' || quote_ident('data_parentData') || ', ' || quote_ident('data_childrenData') || ')  VALUES (' || quote_literal(data.id) || ', ' || quote_literal(data.parent_data) ||  ')';

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
              EXECUTE 'INSERT INTO sample_donor__subject_childrensample ( sample_donor, ' || quote_ident('subject_childrenSample') || ')  VALUES (' || quote_literal(sample.id) || ', ' || quote_literal(sample.parent_subject) ||  ')';

          ELSE
              RAISE info 'data parent_subject is NULL';
          END IF;

          IF sample.parent_sample IS NOT NULL THEN
              RAISE info 'sample parent_sample %', sample.parent_sample;
              EXECUTE 'INSERT INTO sample_parentsample__sample_childrensample (' || quote_ident('sample_parentSample') || ', ' || quote_ident('sample_childrenSample') || ')  VALUES (' || quote_literal(sample.id) || ', ' || quote_literal(sample.parent_sample) ||  ')';

          ELSE
              RAISE info 'sample parent_sample is NULL';
          END IF;

      END LOOP;

      RAISE info 'Done creating data parents migration.';
      RETURN 1;
  END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION remove_columns_one_to_many_associations() RETURNS integer AS $$

  BEGIN

    ALTER TABLE data DROP COLUMN parent_subject;
    ALTER TABLE data DROP COLUMN parent_sample;
    ALTER TABLE data DROP COLUMN parent_data;

    ALTER TABLE sample DROP COLUMN parent_subject;
    ALTER TABLE sample DROP COLUMN parent_sample;

    RETURN 1;
  END;
$$ LANGUAGE plpgsql;

DROP FUNCTION main_migration(int);

CREATE OR REPLACE FUNCTION main_migration() RETURNS integer AS $$

  BEGIN
    PERFORM apply_schema_changes();
    PERFORM data_parents_migration();
    PERFORM sample_parents_migration();
    PERFORM remove_columns_one_to_many_associations();

    DROP FUNCTION apply_schema_changes();
    DROP FUNCTION data_parents_migration();
    DROP FUNCTION sample_parents_migration();
    DROP FUNCTION remove_columns_one_to_many_associations();

    RETURN 1;
  END;
$$ LANGUAGE plpgsql;


SELECT * FROM main_migration();-- set the id of default project
