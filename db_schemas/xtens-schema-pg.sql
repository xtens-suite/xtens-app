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

CREATE USER xtenspg WITH PASSWORD 'xtenspg';

CREATE DATABASE xtensdb OWNER xtenspg;
\c xtensdb
--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: datatype_privilege_level; Type: TYPE; Schema: public; Owner: xtenspg
--

CREATE TYPE datatype_privilege_level AS ENUM (
    'view_overview',
    'view_details',
    'download',
    'edit'
);

CREATE TYPE daemon_status AS ENUM (
    'initializing',
    'error',
    'running',
    'success'
);


ALTER TYPE datatype_privilege_level OWNER TO xtenspg;

ALTER TYPE daemon_status OWNER TO xtenspg;

--
-- Name: dom_basicdatatype; Type: DOMAIN; Schema: public; Owner: xtenspg
--

CREATE DOMAIN dom_basicdatatype AS text COLLATE pg_catalog."C.UTF-8"
	CONSTRAINT dom_basicdatatype_check CHECK (((length(VALUE) > 3) AND (length(VALUE) < 32)));


ALTER DOMAIN dom_basicdatatype OWNER TO xtenspg;

--
-- Name: dom_componentdatatypename; Type: DOMAIN; Schema: public; Owner: xtenspg
--

CREATE DOMAIN dom_componentdatatypename AS text
	CONSTRAINT dom_componentdatatypename_check CHECK ((((length(VALUE) > 2) AND (length(VALUE) < 100)) AND (VALUE ~ '^[A-Za-z][A-Za-z0-9]+$'::text)));


ALTER DOMAIN dom_componentdatatypename OWNER TO xtenspg;

--
-- Name: dom_leaftype; Type: DOMAIN; Schema: public; Owner: xtenspg
--

CREATE DOMAIN dom_leaftype AS text NOT NULL
	CONSTRAINT dom_leaftype_check CHECK (((length(VALUE) > 3) AND (length(VALUE) <= 50)));


ALTER DOMAIN dom_leaftype OWNER TO xtenspg;

--
-- Name: dom_nodename; Type: DOMAIN; Schema: public; Owner: xtenspg
--

CREATE DOMAIN dom_nodename AS text COLLATE pg_catalog."C.UTF-8"
	CONSTRAINT dom_nodename_check CHECK (((length(VALUE) > 2) AND (length(VALUE) < 100)));


ALTER DOMAIN dom_nodename OWNER TO xtenspg;

--
-- Name: xtens_group_privileges; Type: TYPE; Schema: public; Owner: xtenspg
--

CREATE TYPE xtens_group_privileges AS ENUM (
    'wheel',
    'admin',
    'standard'
);


ALTER TYPE xtens_group_privileges OWNER TO xtenspg;

SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE address_information (
    id integer NOT NULL,
    office text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL,
    zip text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE address_information OWNER TO xtenspg;

--
-- Name: address_information_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE address_information_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE address_information_id_seq OWNER TO xtenspg;

--
-- Name: address_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE address_information_id_seq OWNED BY address_information.id;

--
-- Name: biobank; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE biobank (
    id integer NOT NULL,
    biobank_id text NOT NULL,
    acronym text NOT NULL,
    name text NOT NULL,
    url text,
    contact_information integer NOT NULL,
    juristic_person text NOT NULL,
    country text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE biobank OWNER TO xtenspg;

--
-- Name: biobank_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE biobank_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE biobank_id_seq OWNER TO xtenspg;

--
-- Name: biobank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE biobank_id_seq OWNED BY biobank.id;


--
-- Name: contact_information; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE contact_information (
    id integer NOT NULL,
    surname text NOT NULL,
    given_name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    address text NOT NULL,
    zip text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE contact_information OWNER TO xtenspg;

--
-- Name: contact_information_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE contact_information_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contact_information_id_seq OWNER TO xtenspg;

--
-- Name: contact_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE contact_information_id_seq OWNED BY contact_information.id;


--
-- Name: data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE data (
    id integer NOT NULL,
    type integer NOT NULL,
    parent_subject integer,
    parent_sample integer,
    parent_data integer,
    acquisition_date date,
    owner integer NOT NULL,
    metadata jsonb NOT NULL,
    tags jsonb,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE data OWNER TO xtenspg;

--
-- Name: data_file; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE data_file (
    id integer NOT NULL,
    uri text NOT NULL,
    details json,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE data_file OWNER TO xtenspg;

--
-- Name: data_file_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE data_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data_file_id_seq OWNER TO xtenspg;

--
-- Name: data_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE data_file_id_seq OWNED BY data_file.id;


--
-- Name: data_files__datafile_data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE data_files__datafile_data (
    id integer NOT NULL,
    data_files integer NOT NULL,
    datafile_data integer NOT NULL
);


ALTER TABLE data_files__datafile_data OWNER TO xtenspg;

--
-- Name: data_files__datafile_data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE data_files__datafile_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data_files__datafile_data_id_seq OWNER TO xtenspg;

--
-- Name: data_files__datafile_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE data_files__datafile_data_id_seq OWNED BY data_files__datafile_data.id;


--
-- Name: data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data_id_seq OWNER TO xtenspg;

--
-- Name: data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE data_id_seq OWNED BY data.id;


--
-- Name: data_type; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE data_type (
    id integer NOT NULL,
    name text NOT NULL,
    model text NOT NULL,
    biobank_code text,
    biobank_prefix text,
    parent_code boolean NOT NULL DEFAULT FALSE,
    parent_no_prefix boolean NOT NULL DEFAULT FALSE,
    super_type integer NOT NULL,
    project integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE data_type OWNER TO xtenspg;

--
-- Name: data_type_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE data_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE data_type_id_seq OWNER TO xtenspg;

--
-- Name: data_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE data_type_id_seq OWNED BY data_type.id;


--
-- Name: datafile_samples__sample_files; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE datafile_samples__sample_files (
    id integer NOT NULL,
    datafile_samples integer NOT NULL,
    sample_files integer NOT NULL
);


ALTER TABLE datafile_samples__sample_files OWNER TO xtenspg;

--
-- Name: datafile_samples__sample_files_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE datafile_samples__sample_files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datafile_samples__sample_files_id_seq OWNER TO xtenspg;

--
-- Name: datafile_samples__sample_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE datafile_samples__sample_files_id_seq OWNED BY datafile_samples__sample_files.id;


--
-- Name: datatype_children__datatype_parents; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE datatype_children__datatype_parents (
    id integer NOT NULL,
    datatype_parents integer NOT NULL,
    datatype_children integer NOT NULL
);


ALTER TABLE datatype_children__datatype_parents OWNER TO xtenspg;

--
-- Name: datatype_children__datatype_parents_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE datatype_children__datatype_parents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datatype_children__datatype_parents_id_seq OWNER TO xtenspg;

--
-- Name: datatype_children__datatype_parents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE datatype_children__datatype_parents_id_seq OWNED BY datatype_children__datatype_parents.id;


--
-- Name: datatype_groups__group_datatypes; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE datatype_groups__group_datatypes (
    id integer NOT NULL,
    datatype_groups integer NOT NULL,
    "group_dataTypes" integer NOT NULL
);


ALTER TABLE datatype_groups__group_datatypes OWNER TO xtenspg;

--
-- Name: datatype_groups__group_datatypes_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE datatype_groups__group_datatypes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datatype_groups__group_datatypes_id_seq OWNER TO xtenspg;

--
-- Name: datatype_groups__group_datatypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE datatype_groups__group_datatypes_id_seq OWNED BY datatype_groups__group_datatypes.id;


--
-- Name: datatype_privileges; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE datatype_privileges (
    id integer NOT NULL,
    data_type integer NOT NULL,
    xtens_group integer NOT NULL,
    privilege_level datatype_privilege_level DEFAULT 'view_overview'::datatype_privilege_level NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE datatype_privileges OWNER TO xtenspg;

--
-- Name: datatype_privileges_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE datatype_privileges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE datatype_privileges_id_seq OWNER TO xtenspg;

--
-- Name: datatype_privileges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE datatype_privileges_id_seq OWNED BY datatype_privileges.id;

--
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
-- MANY SUBJECT - MANY SUBJECT
-- Name: subject_parentsubject__subject_childrensubject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE subject_parentsubject__subject_childrensubject (
    id integer NOT NULL,
    "subject_parentSubject" integer NOT NULL,
    "subject_childrenSubject" integer NOT NULL
);


ALTER TABLE subject_parentsubject__subject_childrensubject OWNER TO xtenspg;

--
-- Name: subject_parentsubject__subject_childrensubject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE subject_parentsubject__subject_childrensubject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE subject_parentsubject__subject_childrensubject_id_seq OWNER TO xtenspg;

--
-- Name: subject_parentsubject__subject_childrensubject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE subject_parentsubject__subject_childrensubject_id_seq OWNED BY subject_parentsubject__subject_childrensubject.id;

--
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
-- Name: eav_attribute; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_attribute (
    id integer NOT NULL,
    data_type integer,
    loop integer,
    name text,
    field_type text,
    has_unit boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_attribute OWNER TO xtenspg;

--
-- Name: eav_attribute_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_attribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_attribute_id_seq OWNER TO xtenspg;

--
-- Name: eav_attribute_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_attribute_id_seq OWNED BY eav_attribute.id;


--
-- Name: eav_loop; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_loop (
    id integer NOT NULL,
    name text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE eav_loop OWNER TO xtenspg;

--
-- Name: eav_loop_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_loop_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_loop_id_seq OWNER TO xtenspg;

--
-- Name: eav_loop_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_loop_id_seq OWNED BY eav_loop.id;


--
-- Name: eav_value_boolean; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_boolean (
    id integer NOT NULL,
    attribute integer,
    value boolean,
    entity_table text,
    entity_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_boolean OWNER TO xtenspg;

--
-- Name: eav_value_boolean_data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_boolean_data (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_boolean_data OWNER TO xtenspg;

--
-- Name: eav_value_boolean_data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_boolean_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_boolean_data_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_boolean_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_boolean_data_id_seq OWNED BY eav_value_boolean_data.id;


--
-- Name: eav_value_boolean_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_boolean_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_boolean_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_boolean_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_boolean_id_seq OWNED BY eav_value_boolean.id;


--
-- Name: eav_value_boolean_sample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_boolean_sample (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_boolean_sample OWNER TO xtenspg;

--
-- Name: eav_value_boolean_sample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_boolean_sample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_boolean_sample_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_boolean_sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_boolean_sample_id_seq OWNED BY eav_value_boolean_sample.id;


--
-- Name: eav_value_boolean_subject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_boolean_subject (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_boolean_subject OWNER TO xtenspg;

--
-- Name: eav_value_boolean_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_boolean_subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_boolean_subject_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_boolean_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_boolean_subject_id_seq OWNED BY eav_value_boolean_subject.id;


--
-- Name: eav_value_date; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_date (
    id integer NOT NULL,
    attribute integer,
    value date,
    entity_table text,
    entity_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_date OWNER TO xtenspg;

--
-- Name: eav_value_date_data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_date_data (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value date,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_date_data OWNER TO xtenspg;

--
-- Name: eav_value_date_data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_date_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_date_data_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_date_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_date_data_id_seq OWNED BY eav_value_date_data.id;


--
-- Name: eav_value_date_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_date_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_date_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_date_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_date_id_seq OWNED BY eav_value_date.id;


--
-- Name: eav_value_date_sample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_date_sample (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value date,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_date_sample OWNER TO xtenspg;

--
-- Name: eav_value_date_sample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_date_sample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_date_sample_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_date_sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_date_sample_id_seq OWNED BY eav_value_date_sample.id;


--
-- Name: eav_value_date_subject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_date_subject (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value date,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_date_subject OWNER TO xtenspg;

--
-- Name: eav_value_date_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_date_subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_date_subject_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_date_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_date_subject_id_seq OWNED BY eav_value_date_subject.id;


--
-- Name: eav_value_float; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_float (
    id integer NOT NULL,
    attribute integer,
    entity_table text,
    entity_id integer,
    value real,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_float OWNER TO xtenspg;

--
-- Name: eav_value_float_data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_float_data (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value real,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_float_data OWNER TO xtenspg;

--
-- Name: eav_value_float_data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_float_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_float_data_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_float_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_float_data_id_seq OWNED BY eav_value_float_data.id;


--
-- Name: eav_value_float_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_float_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_float_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_float_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_float_id_seq OWNED BY eav_value_float.id;


--
-- Name: eav_value_float_sample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_float_sample (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value real,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_float_sample OWNER TO xtenspg;

--
-- Name: eav_value_float_sample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_float_sample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_float_sample_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_float_sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_float_sample_id_seq OWNED BY eav_value_float_sample.id;


--
-- Name: eav_value_float_subject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_float_subject (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value real,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_float_subject OWNER TO xtenspg;

--
-- Name: eav_value_float_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_float_subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_float_subject_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_float_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_float_subject_id_seq OWNED BY eav_value_float_subject.id;


--
-- Name: eav_value_integer; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_integer (
    id integer NOT NULL,
    attribute integer,
    value integer,
    unit text,
    entity_table text,
    entity_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_integer OWNER TO xtenspg;

--
-- Name: eav_value_integer_data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_integer_data (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value integer,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_integer_data OWNER TO xtenspg;

--
-- Name: eav_value_integer_data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_integer_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_integer_data_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_integer_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_integer_data_id_seq OWNED BY eav_value_integer_data.id;


--
-- Name: eav_value_integer_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_integer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_integer_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_integer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_integer_id_seq OWNED BY eav_value_integer.id;


--
-- Name: eav_value_integer_sample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_integer_sample (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value integer,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_integer_sample OWNER TO xtenspg;

--
-- Name: eav_value_integer_sample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_integer_sample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_integer_sample_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_integer_sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_integer_sample_id_seq OWNED BY eav_value_integer_sample.id;


--
-- Name: eav_value_integer_subject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_integer_subject (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value integer,
    unit text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_integer_subject OWNER TO xtenspg;

--
-- Name: eav_value_integer_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_integer_subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_integer_subject_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_integer_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_integer_subject_id_seq OWNED BY eav_value_integer_subject.id;


--
-- Name: eav_value_text; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_text (
    id integer NOT NULL,
    attribute integer,
    value text,
    entity_table text,
    entity_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_text OWNER TO xtenspg;

--
-- Name: eav_value_text_data; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_text_data (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_text_data OWNER TO xtenspg;

--
-- Name: eav_value_text_data_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_text_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_text_data_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_text_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_text_data_id_seq OWNED BY eav_value_text_data.id;


--
-- Name: eav_value_text_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_text_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_text_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_text_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_text_id_seq OWNED BY eav_value_text.id;


--
-- Name: eav_value_text_sample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_text_sample (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_text_sample OWNER TO xtenspg;

--
-- Name: eav_value_text_sample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_text_sample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_text_sample_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_text_sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_text_sample_id_seq OWNED BY eav_value_text_sample.id;


--
-- Name: eav_value_text_subject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE eav_value_text_subject (
    id integer NOT NULL,
    entity integer,
    attribute integer,
    value text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE eav_value_text_subject OWNER TO xtenspg;

--
-- Name: eav_value_text_subject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE eav_value_text_subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eav_value_text_subject_id_seq OWNER TO xtenspg;

--
-- Name: eav_value_text_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE eav_value_text_subject_id_seq OWNED BY eav_value_text_subject.id;


--
-- Name: germline_variant; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE germline_variant (
    id integer NOT NULL,
    metadata jsonb NOT NULL
);


ALTER TABLE germline_variant OWNER TO xtenspg;

--
-- Name: germline_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE germline_variant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE germline_variant_id_seq OWNER TO xtenspg;

--
-- Name: germline_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE germline_variant_id_seq OWNED BY germline_variant.id;


--
-- Name: group_members__operator_groups; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE group_members__operator_groups (
    id integer NOT NULL,
    group_members integer NOT NULL,
    operator_groups integer NOT NULL
);


ALTER TABLE group_members__operator_groups OWNER TO xtenspg;

--
-- Name: group_members__operator_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE group_members__operator_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE group_members__operator_groups_id_seq OWNER TO xtenspg;

--
-- Name: group_members__operator_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE group_members__operator_groups_id_seq OWNED BY group_members__operator_groups.id;


--
-- Name: operator; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE operator (
    id integer NOT NULL,
    login text NOT NULL,
    last_name text NOT NULL,
    first_name text NOT NULL,
    birth_date timestamp with time zone NOT NULL,
    sex text NOT NULL,
    email text NOT NULL,
    address_information integer,
    last_pswd_update timestamp with time zone NOT NULL DEFAULT now(),
    reset_pswd boolean NOT NULL DEFAULT FALSE,
    queries text NOT NULL DEFAULT '[]',
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE operator OWNER TO xtenspg;

--
-- Name: operator_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE operator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE operator_id_seq OWNER TO xtenspg;

--
-- Name: operator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE operator_id_seq OWNED BY operator.id;


--
-- Name: passport; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE passport (
    id integer NOT NULL,
    protocol text NOT NULL,
    password text NOT NULL,
    access_token text NOT NULL,
    provider text,
    identifier text,
    tokens jsonb,
    operator integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT password_chk CHECK ((char_length(password) >= 8))
);


ALTER TABLE passport OWNER TO xtenspg;

--
-- Name: passport_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE passport_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE passport_id_seq OWNER TO xtenspg;

--
-- Name: passport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE passport_id_seq OWNED BY passport.id;


--
-- Name: personal_details; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE personal_details (
    id integer NOT NULL,
    surname text NOT NULL,
    given_name text NOT NULL,
    birth_date date NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE personal_details OWNER TO xtenspg;

--
-- Name: personal_details_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE personal_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE personal_details_id_seq OWNER TO xtenspg;

--
-- Name: personal_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE personal_details_id_seq OWNED BY personal_details.id;


--
-- Name: project; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE project (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE project OWNER TO xtenspg;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE project_id_seq OWNER TO xtenspg;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE project_id_seq OWNED BY project.id;


--
-- Name: group_projects__project_groups; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE group_projects__project_groups (
    id integer NOT NULL,
    project_groups integer NOT NULL,
    group_projects integer NOT NULL
);


ALTER TABLE group_projects__project_groups OWNER TO xtenspg;

--
-- Name: group_projects__project_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE group_projects__project_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE group_projects__project_groups_id_seq OWNER TO xtenspg;

--
-- Name: group_projects__project_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE group_projects__project_groups_id_seq OWNED BY group_projects__project_groups.id;


--
-- Name: daemon; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE daemon (
    id integer NOT NULL,
    pid integer NOT NULL,
    source text NOT NULL,
    operator integer NOT NULL,
    status daemon_status DEFAULT 'initializing'::daemon_status NOT NULL,
    info jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE daemon OWNER TO xtenspg;

--
-- Name: daemon_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE daemon_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE daemon_id_seq OWNER TO xtenspg;

--
-- Name: daemon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE daemon_id_seq OWNED BY daemon.id;

--
-- Name: sample; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE sample (
    id integer UNIQUE NOT NULL,
    type integer NOT NULL,
    parent_subject integer NOT NULL,
    parent_sample integer,
    biobank integer NOT NULL,
    biobank_code text NOT NULL,
    owner integer NOT NULL,
    metadata jsonb NOT NULL,
    tags jsonb,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE sample OWNER TO xtenspg;

--
-- Name: sample_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE sample_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sample_id_seq OWNER TO xtenspg;

--
-- Name: sample_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE sample_id_seq OWNED BY sample.id;


--
-- Name: somatic_variant; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE somatic_variant (
    id integer NOT NULL,
    metadata jsonb NOT NULL
);


ALTER TABLE somatic_variant OWNER TO xtenspg;

--
-- Name: somatic_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE somatic_variant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE somatic_variant_id_seq OWNER TO xtenspg;

--
-- Name: somatic_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE somatic_variant_id_seq OWNED BY somatic_variant.id;


--
-- Name: subject; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE subject (
    id integer UNIQUE NOT NULL,
    type integer NOT NULL,
    personal_info integer,
    code text NOT NULL,
    sex text NOT NULL,
    owner integer NOT NULL,
    metadata jsonb NOT NULL,
    tags jsonb,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE subject OWNER TO xtenspg;

--
-- Name: subject_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE subject_id_seq OWNER TO xtenspg;

--
-- Name: subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE subject_id_seq OWNED BY subject.id;


--
-- Name: super_type; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE super_type (
    id integer NOT NULL,
    name text NOT NULL,
    uri text NOT NULL,
    schema jsonb NOT NULL,
    skip_paging boolean DEFAULT FALSE NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE super_type OWNER TO xtenspg;

-- Name: super_type_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE super_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE super_type_id_seq OWNER TO xtenspg;

--
-- Name: super_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE super_type_id_seq OWNED BY super_type.id;


--
-- Name: xtens_group; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE xtens_group (
    id integer NOT NULL,
    name text NOT NULL,
    privilege_level xtens_group_privileges DEFAULT 'standard'::xtens_group_privileges NOT NULL,
    personal_data_access boolean DEFAULT false NOT NULL,
    sensitive_data_access boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE xtens_group OWNER TO xtenspg;

--
-- Name: xtens_group_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE xtens_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE xtens_group_id_seq OWNER TO xtenspg;

--
-- Name: xtens_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE xtens_group_id_seq OWNED BY xtens_group.id;



--
-- Name: biobank_projects__project_biobanks; Type: TABLE; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE TABLE biobank_projects__project_biobanks (
    id integer NOT NULL,
    project_biobanks integer NOT NULL,
    biobank_projects integer NOT NULL
);


ALTER TABLE biobank_projects__project_biobanks OWNER TO xtenspg;

--
-- Name: biobank_projects__project_biobanks_id_seq; Type: SEQUENCE; Schema: public; Owner: xtenspg
--

CREATE SEQUENCE biobank_projects__project_biobanks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE biobank_projects__project_biobanks_id_seq OWNER TO xtenspg;

--
-- Name: biobank_projects__project_biobanks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xtenspg
--

ALTER SEQUENCE biobank_projects__project_biobanks_id_seq OWNED BY biobank_projects__project_biobanks.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY address_information ALTER COLUMN id SET DEFAULT nextval('address_information_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY biobank ALTER COLUMN id SET DEFAULT nextval('biobank_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY contact_information ALTER COLUMN id SET DEFAULT nextval('contact_information_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data ALTER COLUMN id SET DEFAULT nextval('data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_file ALTER COLUMN id SET DEFAULT nextval('data_file_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_files__datafile_data ALTER COLUMN id SET DEFAULT nextval('data_files__datafile_data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_type ALTER COLUMN id SET DEFAULT nextval('data_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datafile_samples__sample_files ALTER COLUMN id SET DEFAULT nextval('datafile_samples__sample_files_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_children__datatype_parents ALTER COLUMN id SET DEFAULT nextval('datatype_children__datatype_parents_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_groups__group_datatypes ALTER COLUMN id SET DEFAULT nextval('datatype_groups__group_datatypes_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_privileges ALTER COLUMN id SET DEFAULT nextval('datatype_privileges_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_attribute ALTER COLUMN id SET DEFAULT nextval('eav_attribute_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_loop ALTER COLUMN id SET DEFAULT nextval('eav_loop_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_boolean ALTER COLUMN id SET DEFAULT nextval('eav_value_boolean_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_boolean_data ALTER COLUMN id SET DEFAULT nextval('eav_value_boolean_data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_boolean_sample ALTER COLUMN id SET DEFAULT nextval('eav_value_boolean_sample_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_boolean_subject ALTER COLUMN id SET DEFAULT nextval('eav_value_boolean_subject_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_date ALTER COLUMN id SET DEFAULT nextval('eav_value_date_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_date_data ALTER COLUMN id SET DEFAULT nextval('eav_value_date_data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_date_sample ALTER COLUMN id SET DEFAULT nextval('eav_value_date_sample_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_date_subject ALTER COLUMN id SET DEFAULT nextval('eav_value_date_subject_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_float ALTER COLUMN id SET DEFAULT nextval('eav_value_float_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_float_data ALTER COLUMN id SET DEFAULT nextval('eav_value_float_data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_float_sample ALTER COLUMN id SET DEFAULT nextval('eav_value_float_sample_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_float_subject ALTER COLUMN id SET DEFAULT nextval('eav_value_float_subject_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_integer ALTER COLUMN id SET DEFAULT nextval('eav_value_integer_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_integer_data ALTER COLUMN id SET DEFAULT nextval('eav_value_integer_data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_integer_sample ALTER COLUMN id SET DEFAULT nextval('eav_value_integer_sample_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_integer_subject ALTER COLUMN id SET DEFAULT nextval('eav_value_integer_subject_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_text ALTER COLUMN id SET DEFAULT nextval('eav_value_text_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_text_data ALTER COLUMN id SET DEFAULT nextval('eav_value_text_data_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_text_sample ALTER COLUMN id SET DEFAULT nextval('eav_value_text_sample_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY eav_value_text_subject ALTER COLUMN id SET DEFAULT nextval('eav_value_text_subject_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY germline_variant ALTER COLUMN id SET DEFAULT nextval('germline_variant_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY group_members__operator_groups ALTER COLUMN id SET DEFAULT nextval('group_members__operator_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY operator ALTER COLUMN id SET DEFAULT nextval('operator_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY passport ALTER COLUMN id SET DEFAULT nextval('passport_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY personal_details ALTER COLUMN id SET DEFAULT nextval('personal_details_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY project ALTER COLUMN id SET DEFAULT nextval('project_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY group_projects__project_groups ALTER COLUMN id SET DEFAULT nextval('group_projects__project_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample ALTER COLUMN id SET DEFAULT nextval('sample_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY daemon ALTER COLUMN id SET DEFAULT nextval('daemon_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY somatic_variant ALTER COLUMN id SET DEFAULT nextval('somatic_variant_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY subject ALTER COLUMN id SET DEFAULT nextval('subject_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY super_type ALTER COLUMN id SET DEFAULT nextval('super_type_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY xtens_group ALTER COLUMN id SET DEFAULT nextval('xtens_group_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY biobank_projects__project_biobanks ALTER COLUMN id SET DEFAULT nextval('biobank_projects__project_biobanks_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY subject_parentsubject__subject_childrensubject ALTER COLUMN id SET DEFAULT nextval('subject_parentsubject__subject_childrensubject_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_parentsubject__subject_childrendata ALTER COLUMN id SET DEFAULT nextval('data_parentsubject__subject_childrendata_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample_donor__subject_childrensample ALTER COLUMN id SET DEFAULT nextval('sample_donor__subject_childrensample_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample_parentsample__sample_childrensample ALTER COLUMN id SET DEFAULT nextval('sample_parentsample__sample_childrensample_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_childrendata__data_parentdata ALTER COLUMN id SET DEFAULT nextval('data_childrendata__data_parentdata_id_seq'::regclass);

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_parentsample__sample_childrendata ALTER COLUMN id SET DEFAULT nextval('data_parentsample__sample_childrendata_id_seq'::regclass);

--
-- Name: address_information_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY address_information
    ADD CONSTRAINT address_information_pkey PRIMARY KEY (id);

--
-- Name: biobank_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY biobank
    ADD CONSTRAINT biobank_pkey PRIMARY KEY (id);


--
-- Name: contact_information_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY contact_information
    ADD CONSTRAINT contact_information_pkey PRIMARY KEY (id);


--
-- Name: data_file_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_file
    ADD CONSTRAINT data_file_pkey PRIMARY KEY (id);


--
-- Name: data_file_uri_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_file
    ADD CONSTRAINT data_file_uri_key UNIQUE (uri);


--
-- Name: data_files__datafile_data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_files__datafile_data
    ADD CONSTRAINT data_files__datafile_data_pkey PRIMARY KEY (id);


--
-- Name: data_files_datafile_data_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_files__datafile_data
    ADD CONSTRAINT data_files_datafile_data_key UNIQUE (data_files, datafile_data);


--
-- Name: data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data
    ADD CONSTRAINT data_pkey PRIMARY KEY (id);


--
-- Name: data_type_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_type
    ADD CONSTRAINT data_type_pkey PRIMARY KEY (id);


--
-- Name: datafile_samples__sample_files_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datafile_samples__sample_files
    ADD CONSTRAINT datafile_samples__sample_files_key UNIQUE (datafile_samples, sample_files);


--
-- Name: datafile_samples__sample_files_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datafile_samples__sample_files
    ADD CONSTRAINT datafile_samples__sample_files_pkey PRIMARY KEY (id);


--
-- Name: datatype_children__datatype_parents_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datatype_children__datatype_parents
    ADD CONSTRAINT datatype_children__datatype_parents_key UNIQUE (datatype_children, datatype_parents);


--
-- Name: datatype_children__datatype_parents_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datatype_children__datatype_parents
    ADD CONSTRAINT datatype_children__datatype_parents_pkey PRIMARY KEY (id);


--
-- Name: datatype_groups__group_datatypes_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datatype_groups__group_datatypes
    ADD CONSTRAINT datatype_groups__group_datatypes_key UNIQUE (datatype_groups, "group_dataTypes");


--
-- Name: datatype_groups__group_datatypes_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datatype_groups__group_datatypes
    ADD CONSTRAINT datatype_groups__group_datatypes_pkey PRIMARY KEY (id);


--
-- Name: datatype_name_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_type
    ADD CONSTRAINT datatype_name_key UNIQUE (name,project);


--
-- Name: datatype_privileges_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datatype_privileges
    ADD CONSTRAINT datatype_privileges_pkey PRIMARY KEY (id);


--
-- Name: datatype_xtensgroup_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY datatype_privileges
    ADD CONSTRAINT datatype_xtensgroup_key UNIQUE (data_type, xtens_group);

--
-- Name: subject_parentsubject__subject_childrensubject_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY subject_parentsubject__subject_childrensubject
    ADD CONSTRAINT subject_parentsubject__subject_childrensubject_key UNIQUE ("subject_parentSubject", "subject_childrenSubject");


--
-- Name: subject_parentsubject__subject_childrensubject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY subject_parentsubject__subject_childrensubject
    ADD CONSTRAINT subject_parentsubject__subject_childrensubject_pkey PRIMARY KEY (id);

--
-- Name: subject_parentsubject__subject_childrensubject; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY subject_parentsubject__subject_childrensubject
    ADD CONSTRAINT subject_children_fkey FOREIGN KEY ("subject_childrenSubject") REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;

--
-- Name: subject_parentsubject__subject_childrensubject; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--
   
ALTER TABLE ONLY subject_parentsubject__subject_childrensubject
    ADD CONSTRAINT subject_parent_fkey FOREIGN KEY ("subject_parentSubject") REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;

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
-- Name: eav_attribute_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_attribute
    ADD CONSTRAINT eav_attribute_pkey PRIMARY KEY (id);


--
-- Name: eav_loop_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_loop
    ADD CONSTRAINT eav_loop_pkey PRIMARY KEY (id);


--
-- Name: eav_value_boolean_data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_boolean_data
    ADD CONSTRAINT eav_value_boolean_data_pkey PRIMARY KEY (id);


--
-- Name: eav_value_boolean_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_boolean
    ADD CONSTRAINT eav_value_boolean_pkey PRIMARY KEY (id);


--
-- Name: eav_value_boolean_sample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_boolean_sample
    ADD CONSTRAINT eav_value_boolean_sample_pkey PRIMARY KEY (id);


--
-- Name: eav_value_boolean_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_boolean_subject
    ADD CONSTRAINT eav_value_boolean_subject_pkey PRIMARY KEY (id);


--
-- Name: eav_value_date_data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_date_data
    ADD CONSTRAINT eav_value_date_data_pkey PRIMARY KEY (id);


--
-- Name: eav_value_date_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_date
    ADD CONSTRAINT eav_value_date_pkey PRIMARY KEY (id);


--
-- Name: eav_value_date_sample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_date_sample
    ADD CONSTRAINT eav_value_date_sample_pkey PRIMARY KEY (id);


--
-- Name: eav_value_date_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_date_subject
    ADD CONSTRAINT eav_value_date_subject_pkey PRIMARY KEY (id);


--
-- Name: eav_value_float_data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_float_data
    ADD CONSTRAINT eav_value_float_data_pkey PRIMARY KEY (id);


--
-- Name: eav_value_float_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_float
    ADD CONSTRAINT eav_value_float_pkey PRIMARY KEY (id);


--
-- Name: eav_value_float_sample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_float_sample
    ADD CONSTRAINT eav_value_float_sample_pkey PRIMARY KEY (id);


--
-- Name: eav_value_float_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_float_subject
    ADD CONSTRAINT eav_value_float_subject_pkey PRIMARY KEY (id);


--
-- Name: eav_value_integer_data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_integer_data
    ADD CONSTRAINT eav_value_integer_data_pkey PRIMARY KEY (id);


--
-- Name: eav_value_integer_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_integer
    ADD CONSTRAINT eav_value_integer_pkey PRIMARY KEY (id);


--
-- Name: eav_value_integer_sample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_integer_sample
    ADD CONSTRAINT eav_value_integer_sample_pkey PRIMARY KEY (id);


--
-- Name: eav_value_integer_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_integer_subject
    ADD CONSTRAINT eav_value_integer_subject_pkey PRIMARY KEY (id);


--
-- Name: eav_value_text_data_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_text_data
    ADD CONSTRAINT eav_value_text_data_pkey PRIMARY KEY (id);


--
-- Name: eav_value_text_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_text
    ADD CONSTRAINT eav_value_text_pkey PRIMARY KEY (id);


--
-- Name: eav_value_text_sample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_text_sample
    ADD CONSTRAINT eav_value_text_sample_pkey PRIMARY KEY (id);


--
-- Name: eav_value_text_subject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY eav_value_text_subject
    ADD CONSTRAINT eav_value_text_subject_pkey PRIMARY KEY (id);


--
-- Name: email_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY contact_information
    ADD CONSTRAINT email_key UNIQUE (email);


--
-- Name: germline_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY germline_variant
    ADD CONSTRAINT germline_variant_pkey PRIMARY KEY (id);


--
-- Name: group_members__operator_groups_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY group_members__operator_groups
    ADD CONSTRAINT group_members__operator_groups_key UNIQUE (group_members, operator_groups);


--
-- Name: group_members__operator_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY group_members__operator_groups
    ADD CONSTRAINT group_members__operator_groups_pkey PRIMARY KEY (id);


--
-- Name: operator_email_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY operator
    ADD CONSTRAINT operator_email_key UNIQUE (email);


--
-- Name: operator_login_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY operator
    ADD CONSTRAINT operator_login_key UNIQUE (login);


--
-- Name: operator_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY operator
    ADD CONSTRAINT operator_pkey PRIMARY KEY (id);

--
-- Name: passport_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY passport
    ADD CONSTRAINT passport_pkey PRIMARY KEY (id);


--
-- Name: personal_details_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY personal_details
    ADD CONSTRAINT personal_details_pkey PRIMARY KEY (id);


--
-- Name: project_name_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY project
    ADD CONSTRAINT project_name_key UNIQUE (name);


--
-- Name: project_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);

--
-- Name: super_type_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY super_type
    ADD CONSTRAINT super_type_pkey PRIMARY KEY (id);


--
-- Name: group_projects__project_groups_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY group_projects__project_groups
    ADD CONSTRAINT group_projects__project_groups_key UNIQUE (project_groups, group_projects);


--
-- Name: group_projects__project_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY group_projects__project_groups
    ADD CONSTRAINT group_projects__project_groups_pkey PRIMARY KEY (id);


--
-- Name: daemon_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY daemon
    ADD CONSTRAINT daemon_pkey PRIMARY KEY (id);

--
-- Name: sample_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY sample
    ADD CONSTRAINT sample_pkey PRIMARY KEY (id);


--
-- Name: somatic_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY somatic_variant
    ADD CONSTRAINT somatic_variant_pkey PRIMARY KEY (id);


--
-- Name: subject_code_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY subject
    ADD CONSTRAINT subject_code_key UNIQUE (code);


--
-- Name: subject_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY subject
    ADD CONSTRAINT subject_pkey PRIMARY KEY (id);


--
-- Name: surname_givenname_birthdate_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY personal_details
    ADD CONSTRAINT surname_givenname_birthdate_key UNIQUE (surname, given_name, birth_date);


--
-- Name: xtens_group_name_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY xtens_group
    ADD CONSTRAINT xtens_group_name_key UNIQUE (name);


--
-- Name: xtens_group_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY xtens_group
    ADD CONSTRAINT xtens_group_pkey PRIMARY KEY (id);


--
-- Name: xtensgroup_name_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY xtens_group
    ADD CONSTRAINT xtensgroup_name_key UNIQUE (name);


--
-- Name: data_parentdata_idx; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX data_parentdata_idx ON data USING btree (parent_data);


--
-- Name: data_type_idx; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX data_type_idx ON data USING btree (type);


--
-- Name: created_at_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX created_at_data_index ON data (created_at DESC);


--
-- Name: created_at_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX created_at_smpl_index ON sample (created_at DESC);


--
-- Name: created_at_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX created_at_sbj_index ON subject (created_at DESC);


--
-- Name: gin_index_data; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX gin_index_data ON data USING gin (metadata);


--
-- Name: gin_index_sample; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX gin_index_sample ON sample USING gin (metadata);


--
-- Name: gin_index_subject; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX gin_index_subject ON subject USING gin (metadata);


--
-- Name: privileges_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
--

CREATE INDEX privileges_index ON datatype_privileges (data_type, xtens_group);

-- --
-- -- Name: join_data_data_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
-- --

-- CREATE INDEX join_data_data_index ON data_childrendata__data_parentdata ("data_parentData", "data_childrenData");

-- --
-- -- Name: join_data_sample_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
-- --

-- CREATE INDEX join_data_sample_index ON data_parentsample__sample_childrendata ("data_parentSample", "sample_childrenData");

-- --
-- -- Name: join_data_subject_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
-- --

-- CREATE INDEX join_data_subject_index ON data_parentsubject__subject_childrendata ("data_parentSubject", "subject_childrenData");

-- --
-- -- Name: join_data_subject_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
-- --

-- CREATE INDEX join_subject_subject_index ON subject_parentsubject__subject_childrensubject ("subject_parentSubject", "subject_childrenSubject");

-- --
-- -- Name: join_sample_sample_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
-- --

-- CREATE INDEX join_sample_sample_index ON sample_parentsample__sample_childrensample ("sample_parentSample", "sample_childrenSample");

-- --
-- -- Name: join_sample_donor_index; Type: INDEX; Schema: public; Owner: xtenspg; Tablespace:
-- --

-- CREATE INDEX join_sample_donor_index ON sample_donor__subject_childrensample ("sample_donor", "subject_childrenSample");


--
-- Name: biobank_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

CREATE INDEX datatype_privileges_data_type_idx ON public.datatype_privileges (data_type);
CREATE INDEX datatype_privileges_xtens_group_idx ON public.datatype_privileges (xtens_group);
CREATE INDEX datatype_groups__group_datatypes_datatype_groups_idx ON public.datatype_groups__group_datatypes (datatype_groups);
CREATE INDEX datatype_groups__group_datatypes_group_datatypes_idx ON public.datatype_groups__group_datatypes ("group_dataTypes");
CREATE INDEX datatype_children__datatype_parents_datatype_parents_idx ON public.datatype_children__datatype_parents (datatype_parents);
CREATE INDEX datatype_children__datatype_parents_datatype_children_idx ON public.datatype_children__datatype_parents (datatype_children);
CREATE INDEX datafile_samples__sample_files_datafile_samples_idx ON public.datafile_samples__sample_files (datafile_samples);
CREATE INDEX datafile_samples__sample_files_sample_files_idx ON public.datafile_samples__sample_files (sample_files);
CREATE INDEX data_files__datafile_data_data_files_idx ON public.data_files__datafile_data (data_files);
CREATE INDEX data_files__datafile_data_datafile_data_idx ON public.data_files__datafile_data (datafile_data);
CREATE INDEX biobank_projects__project_biobanks_project_biobanks_idx ON public.biobank_projects__project_biobanks (project_biobanks);
CREATE INDEX biobank_projects__project_biobanks_biobank_projects_idx ON public.biobank_projects__project_biobanks (biobank_projects);


CREATE INDEX data_childrendata__data_parentdata_data_parentdata_idx ON public.data_childrendata__data_parentdata ("data_parentData");

CREATE INDEX data_childrendata__data_parentdata_data_childrendata_idx ON public.data_childrendata__data_parentdata ("data_childrenData");

CREATE INDEX data_parentsample__sample_childrendata_data_parentsample_idx ON public.data_parentsample__sample_childrendata ("data_parentSample");

CREATE INDEX data_parentsample__sample_childrendata_sample_childrendata_idx ON public.data_parentsample__sample_childrendata ("sample_childrenData");

CREATE INDEX data_parentsubject__subject_childrendata_data_parentsubject_idx ON public.data_parentsubject__subject_childrendata ("data_parentSubject");

CREATE INDEX data_parentsubject__subject_childrendata_subject_childrendata_idx ON public.data_parentsubject__subject_childrendata ("subject_childrenData");

CREATE INDEX sample_donor__subject_childrensample_sample_donor_idx ON public.sample_donor__subject_childrensample (sample_donor);

CREATE INDEX sample_donor__subject_childrensample_subject_childrensample_idx ON public.sample_donor__subject_childrensample ("subject_childrenSample");

CREATE INDEX sample_parentsample__sample_childrensample_sample_parentsample_idx ON public.sample_parentsample__sample_childrensample ("sample_parentSample");

CREATE INDEX sample_parentsample__sample_childrensample_sample_childrensample_idx ON public.sample_parentsample__sample_childrensample ("sample_childrenSample");

CREATE INDEX subject_parentsubject__subject_childrensubject_subject_parentsubject_idx ON public.subject_parentsubject__subject_childrensubject ("subject_parentSubject");

CREATE INDEX subject_parentsubject__subject_childrensubject_subject_childrensubject_idx ON public.subject_parentsubject__subject_childrensubject ("subject_childrenSubject");


ALTER TABLE ONLY sample
    ADD CONSTRAINT biobank_fkey FOREIGN KEY (biobank) REFERENCES biobank(id) MATCH FULL ON DELETE CASCADE;

--
-- Name: owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data
    ADD CONSTRAINT owner_fkey FOREIGN KEY (owner) REFERENCES operator(id) MATCH FULL;

--
-- Name: owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample
    ADD CONSTRAINT owner_fkey FOREIGN KEY (owner) REFERENCES operator(id) MATCH FULL;

--
-- Name: owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY subject
    ADD CONSTRAINT owner_fkey FOREIGN KEY (owner) REFERENCES operator(id) MATCH FULL;

--
-- Name: address_information_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY operator
    ADD CONSTRAINT address_information_fkey FOREIGN KEY (address_information) REFERENCES address_information(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: contact_information_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY biobank
    ADD CONSTRAINT contact_information_fkey FOREIGN KEY (contact_information) REFERENCES contact_information(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: data_files_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_files__datafile_data
    ADD CONSTRAINT data_files_fkey FOREIGN KEY (data_files) REFERENCES data(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: data_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_privileges
    ADD CONSTRAINT data_type_fkey FOREIGN KEY (data_type) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;

--
-- Name: project_fkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY data_type
    ADD CONSTRAINT project_fkey FOREIGN KEY (project) REFERENCES project(id) MATCH FULL ON DELETE CASCADE;

--
-- Name: super_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_type
    ADD CONSTRAINT super_type_fkey FOREIGN KEY (super_type) REFERENCES super_type(id) MATCH FULL ON DELETE RESTRICT;

--
-- Name: datafile_data_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data_files__datafile_data
    ADD CONSTRAINT datafile_data_fkey FOREIGN KEY (datafile_data) REFERENCES data_file(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: datafile_samples_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datafile_samples__sample_files
    ADD CONSTRAINT datafile_samples_fkey FOREIGN KEY (datafile_samples) REFERENCES data_file(id) MATCH FULL;


--
-- Name: datatype_children_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_children__datatype_parents
    ADD CONSTRAINT datatype_children_fkey FOREIGN KEY (datatype_children) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: datatype_groups_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_groups__group_datatypes
    ADD CONSTRAINT datatype_groups_fkey FOREIGN KEY (datatype_groups) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: datatype_parents_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_children__datatype_parents
    ADD CONSTRAINT datatype_parents_fkey FOREIGN KEY (datatype_parents) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: group_datatypes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_groups__group_datatypes
    ADD CONSTRAINT group_datatypes_fkey FOREIGN KEY ("group_dataTypes") REFERENCES xtens_group(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: group_members_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY group_members__operator_groups
    ADD CONSTRAINT group_members_fkey FOREIGN KEY (group_members) REFERENCES xtens_group(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: operator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY passport
    ADD CONSTRAINT operator_fkey FOREIGN KEY (operator) REFERENCES operator(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: operator_groups_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY group_members__operator_groups
    ADD CONSTRAINT operator_groups_fkey FOREIGN KEY (operator_groups) REFERENCES operator(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: parent_data_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data
    ADD CONSTRAINT parent_data_fkey FOREIGN KEY (parent_data) REFERENCES data(id) MATCH FULL ON DELETE CASCADE;

--
-- Name: operator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY daemon
    ADD CONSTRAINT operator_fkey FOREIGN KEY (operator) REFERENCES operator(id) MATCH FULL;


--
-- Name: parent_sample_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample
    ADD CONSTRAINT parent_sample_fkey FOREIGN KEY (parent_sample) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: parent_sample_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data
    ADD CONSTRAINT parent_sample_fkey FOREIGN KEY (parent_sample) REFERENCES sample(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: parent_subject_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample
    ADD CONSTRAINT parent_subject_fkey FOREIGN KEY (parent_subject) REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: parent_subject_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data
    ADD CONSTRAINT parent_subject_fkey FOREIGN KEY (parent_subject) REFERENCES subject(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: personal_info_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY subject
    ADD CONSTRAINT personal_info_fkey FOREIGN KEY (personal_info) REFERENCES personal_details(id) MATCH FULL ON DELETE RESTRICT;


--
-- Name: project_subjects_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY group_projects__project_groups
    ADD CONSTRAINT project_groups_fkey FOREIGN KEY (project_groups) REFERENCES project(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: sample_files_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datafile_samples__sample_files
    ADD CONSTRAINT sample_files_fkey FOREIGN KEY (sample_files) REFERENCES sample(id) MATCH FULL;


--
-- Name: subject_projects_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY group_projects__project_groups
    ADD CONSTRAINT group_projects_fkey FOREIGN KEY (group_projects) REFERENCES xtens_group(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY data
    ADD CONSTRAINT type_fkey FOREIGN KEY (type) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY sample
    ADD CONSTRAINT type_fkey FOREIGN KEY (type) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY subject
    ADD CONSTRAINT type_fkey FOREIGN KEY (type) REFERENCES data_type(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: xtens_group_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY datatype_privileges
    ADD CONSTRAINT xtens_group_fkey FOREIGN KEY (xtens_group) REFERENCES xtens_group(id) MATCH FULL ON DELETE CASCADE;


--
-- Name: biobank_projects__project_biobanks_key; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT biobank_projects__project_biobanks_key UNIQUE (project_biobanks, biobank_projects);


--
-- Name: biobank_projects__project_biobanks_pkey; Type: CONSTRAINT; Schema: public; Owner: xtenspg; Tablespace:
--

ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT biobank_projects__project_biobanks_pkey PRIMARY KEY (id);

--
-- Name: project_subjects_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT project_biobanks_fkey FOREIGN KEY (project_biobanks) REFERENCES project(id) MATCH FULL ON DELETE CASCADE;



--
-- Name: subject_projects_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xtenspg
--

ALTER TABLE ONLY biobank_projects__project_biobanks
    ADD CONSTRAINT biobank_projects_fkey FOREIGN KEY (biobank_projects) REFERENCES biobank(id) MATCH FULL ON DELETE CASCADE;

--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: dom_componentdatatypename; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TYPE dom_componentdatatypename FROM PUBLIC;
REVOKE ALL ON TYPE dom_componentdatatypename FROM xtenspg;
GRANT ALL ON TYPE dom_componentdatatypename TO xtenspg;
GRANT ALL ON TYPE dom_componentdatatypename TO PUBLIC;


--
-- Name: dom_leaftype; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TYPE dom_leaftype FROM PUBLIC;
REVOKE ALL ON TYPE dom_leaftype FROM xtenspg;
GRANT ALL ON TYPE dom_leaftype TO xtenspg;
GRANT ALL ON TYPE dom_leaftype TO PUBLIC;


--
-- Name: biobank; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE biobank FROM PUBLIC;
REVOKE ALL ON TABLE biobank FROM xtenspg;
GRANT ALL ON TABLE biobank TO xtenspg;


--
-- Name: biobank_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE biobank_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE biobank_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE biobank_id_seq TO xtenspg;


--
-- Name: contact_information; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE contact_information FROM PUBLIC;
REVOKE ALL ON TABLE contact_information FROM xtenspg;
GRANT ALL ON TABLE contact_information TO xtenspg;


--
-- Name: contact_information_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE contact_information_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE contact_information_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE contact_information_id_seq TO xtenspg;


--
-- Name: data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE data FROM PUBLIC;
REVOKE ALL ON TABLE data FROM xtenspg;
GRANT ALL ON TABLE data TO xtenspg;


--
-- Name: data_file; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE data_file FROM PUBLIC;
REVOKE ALL ON TABLE data_file FROM xtenspg;
GRANT ALL ON TABLE data_file TO xtenspg;


--
-- Name: data_file_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE data_file_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE data_file_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE data_file_id_seq TO xtenspg;


--
-- Name: data_files__datafile_data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE data_files__datafile_data FROM PUBLIC;
REVOKE ALL ON TABLE data_files__datafile_data FROM xtenspg;
GRANT ALL ON TABLE data_files__datafile_data TO xtenspg;


--
-- Name: data_files__datafile_data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE data_files__datafile_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE data_files__datafile_data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE data_files__datafile_data_id_seq TO xtenspg;


--
-- Name: data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE data_id_seq TO xtenspg;


--
-- Name: data_type; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE data_type FROM PUBLIC;
REVOKE ALL ON TABLE data_type FROM xtenspg;
GRANT ALL ON TABLE data_type TO xtenspg;


--
-- Name: data_type_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE data_type_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE data_type_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE data_type_id_seq TO xtenspg;


--
-- Name: datafile_samples__sample_files; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE datafile_samples__sample_files FROM PUBLIC;
REVOKE ALL ON TABLE datafile_samples__sample_files FROM xtenspg;
GRANT ALL ON TABLE datafile_samples__sample_files TO xtenspg;


--
-- Name: datafile_samples__sample_files_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE datafile_samples__sample_files_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE datafile_samples__sample_files_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE datafile_samples__sample_files_id_seq TO xtenspg;


--
-- Name: datatype_children__datatype_parents; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE datatype_children__datatype_parents FROM PUBLIC;
REVOKE ALL ON TABLE datatype_children__datatype_parents FROM xtenspg;
GRANT ALL ON TABLE datatype_children__datatype_parents TO xtenspg;


--
-- Name: datatype_children__datatype_parents_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE datatype_children__datatype_parents_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE datatype_children__datatype_parents_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE datatype_children__datatype_parents_id_seq TO xtenspg;


--
-- Name: datatype_groups__group_datatypes; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE datatype_groups__group_datatypes FROM PUBLIC;
REVOKE ALL ON TABLE datatype_groups__group_datatypes FROM xtenspg;
GRANT ALL ON TABLE datatype_groups__group_datatypes TO xtenspg;


--
-- Name: datatype_groups__group_datatypes_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE datatype_groups__group_datatypes_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE datatype_groups__group_datatypes_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE datatype_groups__group_datatypes_id_seq TO xtenspg;


--
-- Name: eav_attribute; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_attribute FROM PUBLIC;
REVOKE ALL ON TABLE eav_attribute FROM xtenspg;
GRANT ALL ON TABLE eav_attribute TO xtenspg;


--
-- Name: eav_attribute_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_attribute_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_attribute_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_attribute_id_seq TO xtenspg;


--
-- Name: eav_loop; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_loop FROM PUBLIC;
REVOKE ALL ON TABLE eav_loop FROM xtenspg;
GRANT ALL ON TABLE eav_loop TO xtenspg;


--
-- Name: eav_loop_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_loop_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_loop_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_loop_id_seq TO xtenspg;


--
-- Name: eav_value_boolean; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_boolean FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_boolean FROM xtenspg;
GRANT ALL ON TABLE eav_value_boolean TO xtenspg;


--
-- Name: eav_value_boolean_data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_boolean_data FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_boolean_data FROM xtenspg;
GRANT ALL ON TABLE eav_value_boolean_data TO xtenspg;


--
-- Name: eav_value_boolean_data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_boolean_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_boolean_data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_boolean_data_id_seq TO xtenspg;


--
-- Name: eav_value_boolean_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_boolean_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_boolean_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_boolean_id_seq TO xtenspg;


--
-- Name: eav_value_boolean_sample; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_boolean_sample FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_boolean_sample FROM xtenspg;
GRANT ALL ON TABLE eav_value_boolean_sample TO xtenspg;


--
-- Name: eav_value_boolean_sample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_boolean_sample_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_boolean_sample_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_boolean_sample_id_seq TO xtenspg;


--
-- Name: eav_value_boolean_subject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_boolean_subject FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_boolean_subject FROM xtenspg;
GRANT ALL ON TABLE eav_value_boolean_subject TO xtenspg;


--
-- Name: eav_value_boolean_subject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_boolean_subject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_boolean_subject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_boolean_subject_id_seq TO xtenspg;


--
-- Name: eav_value_date; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_date FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_date FROM xtenspg;
GRANT ALL ON TABLE eav_value_date TO xtenspg;


--
-- Name: eav_value_date_data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_date_data FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_date_data FROM xtenspg;
GRANT ALL ON TABLE eav_value_date_data TO xtenspg;


--
-- Name: eav_value_date_data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_date_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_date_data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_date_data_id_seq TO xtenspg;


--
-- Name: eav_value_date_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_date_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_date_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_date_id_seq TO xtenspg;


--
-- Name: eav_value_date_sample; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_date_sample FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_date_sample FROM xtenspg;
GRANT ALL ON TABLE eav_value_date_sample TO xtenspg;


--
-- Name: eav_value_date_sample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_date_sample_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_date_sample_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_date_sample_id_seq TO xtenspg;


--
-- Name: eav_value_date_subject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_date_subject FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_date_subject FROM xtenspg;
GRANT ALL ON TABLE eav_value_date_subject TO xtenspg;


--
-- Name: eav_value_date_subject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_date_subject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_date_subject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_date_subject_id_seq TO xtenspg;


--
-- Name: eav_value_float; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_float FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_float FROM xtenspg;
GRANT ALL ON TABLE eav_value_float TO xtenspg;


--
-- Name: eav_value_float_data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_float_data FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_float_data FROM xtenspg;
GRANT ALL ON TABLE eav_value_float_data TO xtenspg;


--
-- Name: eav_value_float_data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_float_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_float_data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_float_data_id_seq TO xtenspg;


--
-- Name: eav_value_float_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_float_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_float_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_float_id_seq TO xtenspg;


--
-- Name: eav_value_float_sample; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_float_sample FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_float_sample FROM xtenspg;
GRANT ALL ON TABLE eav_value_float_sample TO xtenspg;


--
-- Name: eav_value_float_sample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_float_sample_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_float_sample_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_float_sample_id_seq TO xtenspg;


--
-- Name: eav_value_float_subject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_float_subject FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_float_subject FROM xtenspg;
GRANT ALL ON TABLE eav_value_float_subject TO xtenspg;


--
-- Name: eav_value_float_subject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_float_subject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_float_subject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_float_subject_id_seq TO xtenspg;


--
-- Name: eav_value_integer; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_integer FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_integer FROM xtenspg;
GRANT ALL ON TABLE eav_value_integer TO xtenspg;


--
-- Name: eav_value_integer_data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_integer_data FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_integer_data FROM xtenspg;
GRANT ALL ON TABLE eav_value_integer_data TO xtenspg;


--
-- Name: eav_value_integer_data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_integer_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_integer_data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_integer_data_id_seq TO xtenspg;


--
-- Name: eav_value_integer_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_integer_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_integer_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_integer_id_seq TO xtenspg;


--
-- Name: eav_value_integer_sample; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_integer_sample FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_integer_sample FROM xtenspg;
GRANT ALL ON TABLE eav_value_integer_sample TO xtenspg;


--
-- Name: eav_value_integer_sample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_integer_sample_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_integer_sample_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_integer_sample_id_seq TO xtenspg;


--
-- Name: eav_value_integer_subject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_integer_subject FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_integer_subject FROM xtenspg;
GRANT ALL ON TABLE eav_value_integer_subject TO xtenspg;


--
-- Name: eav_value_integer_subject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_integer_subject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_integer_subject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_integer_subject_id_seq TO xtenspg;


--
-- Name: eav_value_text; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_text FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_text FROM xtenspg;
GRANT ALL ON TABLE eav_value_text TO xtenspg;


--
-- Name: eav_value_text_data; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_text_data FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_text_data FROM xtenspg;
GRANT ALL ON TABLE eav_value_text_data TO xtenspg;


--
-- Name: eav_value_text_data_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_text_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_text_data_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_text_data_id_seq TO xtenspg;


--
-- Name: eav_value_text_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_text_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_text_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_text_id_seq TO xtenspg;


--
-- Name: eav_value_text_sample; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_text_sample FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_text_sample FROM xtenspg;
GRANT ALL ON TABLE eav_value_text_sample TO xtenspg;


--
-- Name: eav_value_text_sample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_text_sample_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_text_sample_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_text_sample_id_seq TO xtenspg;


--
-- Name: eav_value_text_subject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE eav_value_text_subject FROM PUBLIC;
REVOKE ALL ON TABLE eav_value_text_subject FROM xtenspg;
GRANT ALL ON TABLE eav_value_text_subject TO xtenspg;


--
-- Name: eav_value_text_subject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE eav_value_text_subject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE eav_value_text_subject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE eav_value_text_subject_id_seq TO xtenspg;


--
-- Name: germline_variant; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE germline_variant FROM PUBLIC;
REVOKE ALL ON TABLE germline_variant FROM xtenspg;
GRANT ALL ON TABLE germline_variant TO xtenspg;


--
-- Name: germline_variant_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE germline_variant_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE germline_variant_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE germline_variant_id_seq TO xtenspg;


--
-- Name: group_members__operator_groups; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE group_members__operator_groups FROM PUBLIC;
REVOKE ALL ON TABLE group_members__operator_groups FROM xtenspg;
GRANT ALL ON TABLE group_members__operator_groups TO xtenspg;


--
-- Name: group_members__operator_groups_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE group_members__operator_groups_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE group_members__operator_groups_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE group_members__operator_groups_id_seq TO xtenspg;


--
-- Name: operator; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE operator FROM PUBLIC;
REVOKE ALL ON TABLE operator FROM xtenspg;
GRANT ALL ON TABLE operator TO xtenspg;


--
-- Name: operator_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE operator_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE operator_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE operator_id_seq TO xtenspg;


--
-- Name: passport; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE passport FROM PUBLIC;
REVOKE ALL ON TABLE passport FROM xtenspg;
GRANT ALL ON TABLE passport TO xtenspg;


--
-- Name: passport_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE passport_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE passport_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE passport_id_seq TO xtenspg;


--
-- Name: personal_details; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE personal_details FROM PUBLIC;
REVOKE ALL ON TABLE personal_details FROM xtenspg;
GRANT ALL ON TABLE personal_details TO xtenspg;


--
-- Name: personal_details_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE personal_details_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE personal_details_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE personal_details_id_seq TO xtenspg;


--
-- Name: project; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE project FROM PUBLIC;
REVOKE ALL ON TABLE project FROM xtenspg;
GRANT ALL ON TABLE project TO xtenspg;


--
-- Name: project_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE project_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE project_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE project_id_seq TO xtenspg;


--
-- Name: group_projects__project_groups; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE group_projects__project_groups FROM PUBLIC;
REVOKE ALL ON TABLE group_projects__project_groups FROM xtenspg;
GRANT ALL ON TABLE group_projects__project_groups TO xtenspg;


--
-- Name: group_projects__project_groups_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE group_projects__project_groups_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE group_projects__project_groups_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE group_projects__project_groups_id_seq TO xtenspg;

--
-- Name: biobank_projects__project_biobanks; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE biobank_projects__project_biobanks FROM PUBLIC;
REVOKE ALL ON TABLE biobank_projects__project_biobanks FROM xtenspg;
GRANT ALL ON TABLE biobank_projects__project_biobanks TO xtenspg;


--
-- Name: biobank_projects__project_biobanks_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE biobank_projects__project_biobanks_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE biobank_projects__project_biobanks_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE biobank_projects__project_biobanks_id_seq TO xtenspg;


--
-- Name: daemon; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE daemon FROM PUBLIC;
REVOKE ALL ON TABLE daemon FROM xtenspg;
GRANT ALL ON TABLE daemon TO xtenspg;


--
-- Name: daemon_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE daemon_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE daemon_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE daemon_id_seq TO xtenspg;


--
-- Name: sample; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE sample FROM PUBLIC;
REVOKE ALL ON TABLE sample FROM xtenspg;
GRANT ALL ON TABLE sample TO xtenspg;


--
-- Name: sample_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE sample_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE sample_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE sample_id_seq TO xtenspg;


--
-- Name: somatic_variant; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE somatic_variant FROM PUBLIC;
REVOKE ALL ON TABLE somatic_variant FROM xtenspg;
GRANT ALL ON TABLE somatic_variant TO xtenspg;


--
-- Name: somatic_variant_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE somatic_variant_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE somatic_variant_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE somatic_variant_id_seq TO xtenspg;


--
-- Name: subject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE subject FROM PUBLIC;
REVOKE ALL ON TABLE subject FROM xtenspg;
GRANT ALL ON TABLE subject TO xtenspg;


--
-- Name: subject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE subject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE subject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE subject_id_seq TO xtenspg;


--
-- Name: xtens_group; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE xtens_group FROM PUBLIC;
REVOKE ALL ON TABLE xtens_group FROM xtenspg;
GRANT ALL ON TABLE xtens_group TO xtenspg;


--
-- Name: xtens_group_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE xtens_group_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE xtens_group_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE xtens_group_id_seq TO xtenspg;


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


--
-- Name: subject_parentsubject__subject_childrensubject; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON TABLE subject_parentsubject__subject_childrensubject FROM PUBLIC;
REVOKE ALL ON TABLE subject_parentsubject__subject_childrensubject FROM xtenspg;
GRANT ALL ON TABLE subject_parentsubject__subject_childrensubject TO xtenspg;

--
-- Name: subject_parentsubject__subject_childrensubject_id_seq; Type: ACL; Schema: public; Owner: xtenspg
--

REVOKE ALL ON SEQUENCE subject_parentsubject__subject_childrensubject_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE subject_parentsubject__subject_childrensubject_id_seq FROM xtenspg;
GRANT ALL ON SEQUENCE subject_parentsubject__subject_childrensubject_id_seq TO xtenspg;

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


--
-- PostgreSQL database dump complete
--
