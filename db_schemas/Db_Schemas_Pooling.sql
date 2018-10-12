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


