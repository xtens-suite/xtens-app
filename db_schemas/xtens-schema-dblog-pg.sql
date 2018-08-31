--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: winston_log_message; Type: TYPE; Schema: public; Owner: xtenspg
--

CREATE TYPE winston_log_message AS ENUM (
    'operation',
    'create',
    'delete',
    'find_one',
    'find',
    'download',
    'update',
    'query'
);

--
-- ALTER TYPE winston_log OWNER TO xtenspg;


CREATE TABLE winston_log (
    id integer NOT NULL,
    level text NOT NULL,
    message winston_log_message DEFAULT 'operation'::winston_log_message NOT NULL,
    meta jsonb NOT NULL
);


ALTER TABLE winston_log OWNER TO xtenspg;

--
-- Name: winston_log_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE winston_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE winston_log_id_seq OWNER TO xtenspg;

--
-- Name: winston_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE winston_log_id_seq OWNED BY winston_log.id;



ALTER TABLE ONLY winston_log ALTER COLUMN id SET DEFAULT nextval('winston_log_id_seq'::regclass);


--
-- Name: winston_log_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY winston_log
    ADD CONSTRAINT winston_log_pkey PRIMARY KEY (id);


--
-- Name: winston_log_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

-- ALTER TABLE ONLY operator
--     ADD CONSTRAINT winston_log_fkey FOREIGN KEY (winston_log) REFERENCES winston_log(id) MATCH FULL ON DELETE CASCADE;



    --
    -- Name: winston_log; Type: ACL; Schema: public; Owner: xtenspg
    --

    REVOKE ALL ON TABLE winston_log FROM PUBLIC;
    REVOKE ALL ON TABLE winston_log FROM xtenspg;
    GRANT ALL ON TABLE winston_log TO xtenspg;


    --
    -- Name: winston_log_id_seq; Type: ACL; Schema: public; Owner: xtenspg
    --

    REVOKE ALL ON SEQUENCE winston_log_id_seq FROM PUBLIC;
    REVOKE ALL ON SEQUENCE winston_log_id_seq FROM xtenspg;
    GRANT ALL ON SEQUENCE winston_log_id_seq TO xtenspg;
