CREATE TABLE hostinfo (
  id SERIAL NOT NULL PRIMARY KEY,
  host_url TEXT,
  host_name TEXT,
  cohost_name TEXT,
  host_about TEXT,
  host_messages TEXT,
  host_identity_verified BOOLEAN,
  host_is_superHost BOOLEAN,
  host_has_profile_pic BOOLEAN,
  host_has_cohost BOOLEAN,
  host_response_time INTEGER,
  host_listings_count INTEGER,
  host_verifications TEXT[],
  host_languages TEXT[],
  modified_at TIMESTAMP,
  created_at TIMESTAMP
);
