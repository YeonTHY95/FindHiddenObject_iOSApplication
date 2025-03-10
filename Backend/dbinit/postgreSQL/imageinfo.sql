--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: imageinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imageinfo (
    "imageID" text NOT NULL,
    "imageName" text NOT NULL,
    "HiddenObjectPixelLocation" jsonb NOT NULL,
    "imageURL" text NOT NULL
);


ALTER TABLE public.imageinfo OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
30376c6f-a4c7-42ac-9fce-bf392e83c461	b61720f48c2935550f5fa3370c3fcbf5d7b8c50a17ff6f9b1c58a72c260ae34a	2024-10-26 15:33:46.247514+08	20241026073346_first_migrate	\N	\N	2024-10-26 15:33:46.239523+08	1
e37dd749-61c2-4333-8533-d57cc14568ef	440165dbf8fd2e46bbd7f5d61339e5e5adc36ee52675a16d2579d161b63a1b12	2024-10-26 15:44:43.326789+08	20241026074443_update_table_name	\N	\N	2024-10-26 15:44:43.315425+08	1
\.


--
-- Data for Name: imageinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imageinfo ("imageID", "imageName", "HiddenObjectPixelLocation", "imageURL") FROM stdin;
8693eaf7-8e62-409e-8449-ac21698ca0f3	UnderTheSea	{"cup": [{"x": 46, "y": 250}, {"x": 68, "y": 252}, {"x": 46, "y": 260}, {"x": 71, "y": 265}], "coin": [{"x": 206, "y": 520}, {"x": 231, "y": 521}, {"x": 205, "y": 529}, {"x": 231, "y": 528}], "fork": [{"x": 29, "y": 294}, {"x": 54, "y": 295}, {"x": 34, "y": 344}, {"x": 50, "y": 346}], "ring": [{"x": 472, "y": 535}, {"x": 501, "y": 534}, {"x": 474, "y": 546}, {"x": 499, "y": 548}], "sock": [{"x": 131, "y": 218}, {"x": 142, "y": 218}, {"x": 131, "y": 225}, {"x": 142, "y": 224}], "button": [{"x": 354, "y": 261}, {"x": 374, "y": 263}, {"x": 354, "y": 276}, {"x": 371, "y": 278}], "crayon": [{"x": 332, "y": 467}, {"x": 346, "y": 470}, {"x": 324, "y": 527}, {"x": 338, "y": 528}], "umbrella": [{"x": 257, "y": 134}, {"x": 298, "y": 141}, {"x": 260, "y": 143}, {"x": 294, "y": 153}], "horseshoe": [{"x": 311, "y": 309}, {"x": 329, "y": 314}, {"x": 309, "y": 332}, {"x": 330, "y": 332}], "toothbrush": [{"x": 228, "y": 234}, {"x": 240, "y": 234}, {"x": 226, "y": 265}, {"x": 234, "y": 270}]}	/UnderTheSea.jpg
6da1439e-9941-40c4-81fe-b2604ebae894	Room	{"shoe": [{"x": 310, "y": 123}, {"x": 334, "y": 133}, {"x": 310, "y": 150}, {"x": 335, "y": 150}], "clock": [{"x": 370, "y": 190}, {"x": 405, "y": 193}, {"x": 372, "y": 211}, {"x": 398, "y": 209}], "bottle": [{"x": 66, "y": 91}, {"x": 80, "y": 94}, {"x": 65, "y": 137}, {"x": 80, "y": 139}], "shovel": [{"x": 46, "y": 197}, {"x": 75, "y": 202}, {"x": 31, "y": 247}, {"x": 49, "y": 250}], "lifebuoy": [{"x": 276, "y": 42}, {"x": 335, "y": 49}, {"x": 273, "y": 103}, {"x": 321, "y": 103}]}	/Room.jpg
7b298696-6b03-4d9a-ae6d-74b683f2b3b2	Beach	{"fish": [{"x": 492, "y": 351}, {"x": 514, "y": 353}, {"x": 490, "y": 361}, {"x": 513, "y": 365}], "kite": [{"x": 265, "y": 391}, {"x": 279, "y": 393}, {"x": 263, "y": 411}, {"x": 276, "y": 420}], "sock": [{"x": 418, "y": 297}, {"x": 459, "y": 301}, {"x": 418, "y": 327}, {"x": 445, "y": 329}], "shell": [{"x": 475, "y": 762}, {"x": 498, "y": 765}, {"x": 477, "y": 782}, {"x": 501, "y": 785}], "mussel": [{"x": 65, "y": 658}, {"x": 98, "y": 661}, {"x": 66, "y": 688}, {"x": 95, "y": 681}], "starfish": [{"x": 156, "y": 758}, {"x": 186, "y": 761}, {"x": 154, "y": 788}, {"x": 184, "y": 790}]}	/Beach.jpg
wtf123	Garden	{"ring": [{"x": 1, "y": 1}]}	/Garden.jpg
greetings123	Greetings	{"pencil": [{"x": 1, "y": 1}]}	/Greetings.jpg
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: imageinfo imageinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imageinfo
    ADD CONSTRAINT imageinfo_pkey PRIMARY KEY ("imageID");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

