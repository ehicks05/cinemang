import { pgTable, index, integer, text, doublePrecision, date, foreignKey, uniqueIndex, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const genreType = pgEnum("GenreType", ['MOVIE', 'SHOW', 'BOTH'])
export const showStatus = pgEnum("ShowStatus", ['ENDED', 'CANCELED', 'RETURNING_SERIES', 'IN_PRODUCTION'])


export const movie = pgTable("movie", {
	id: integer().primaryKey().notNull(),
	cast: text().notNull(),
	certification: text(),
	director: text().notNull(),
	genreId: integer("genre_id").notNull(),
	imdbId: text("imdb_id").notNull(),
	languageId: text("language_id").notNull(),
	overview: text().notNull(),
	popularity: doublePrecision().notNull(),
	posterPath: text("poster_path").notNull(),
	releasedAt: date("released_at", {mode: 'date'}).notNull(),
	runtime: integer().notNull(),
	title: text().notNull(),
	voteAverage: doublePrecision("vote_average").notNull(),
	voteCount: integer("vote_count").notNull(),
}, (table) => [
	index("movie_language_id_idx").using("btree", table.languageId.asc().nullsLast().op("text_ops")),
	index("movie_released_at_idx").using("btree", table.releasedAt.asc().nullsLast().op("date_ops")),
	index("movie_title_idx").using("gin", table.title.asc().nullsLast().op("gin_trgm_ops")),
	index("movie_vote_average_idx").using("btree", table.voteAverage.asc().nullsLast().op("float8_ops")),
	index("movie_vote_count_idx").using("btree", table.voteCount.asc().nullsLast().op("int4_ops")),
]);

export const credit = pgTable("credit", {
	creditId: text("credit_id").primaryKey().notNull(),
	movieId: integer("movie_id"),
	showId: integer("show_id"),
	personId: integer("person_id").notNull(),
	character: text(),
	order: integer(),
	department: text(),
	job: text(),
}, (table) => [
	index("credit_movie_id_idx").using("btree", table.movieId.asc().nullsLast().op("int4_ops")),
	index("credit_person_id_idx").using("btree", table.personId.asc().nullsLast().op("int4_ops")),
	index("credit_show_id_idx").using("btree", table.showId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.movieId],
			foreignColumns: [movie.id],
			name: "credit_movie_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.personId],
			foreignColumns: [person.id],
			name: "credit_person_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [show.id],
			name: "credit_show_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const mediaProvider = pgTable("media_provider", {
	id: text().primaryKey().notNull(),
	movieId: integer("movie_id"),
	showId: integer("show_id"),
	providerId: integer("provider_id").notNull(),
}, (table) => [
	index("media_provider_movie_id_idx").using("btree", table.movieId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("media_provider_movie_id_provider_id_key").using("btree", table.movieId.asc().nullsLast().op("int4_ops"), table.providerId.asc().nullsLast().op("int4_ops")),
	index("media_provider_provider_id_idx").using("btree", table.providerId.asc().nullsLast().op("int4_ops")),
	index("media_provider_show_id_idx").using("btree", table.showId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("media_provider_show_id_provider_id_key").using("btree", table.showId.asc().nullsLast().op("int4_ops"), table.providerId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.movieId],
			foreignColumns: [movie.id],
			name: "media_provider_movie_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.providerId],
			foreignColumns: [provider.id],
			name: "media_provider_provider_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [show.id],
			name: "media_provider_show_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const provider = pgTable("provider", {
	id: integer().primaryKey().notNull(),
	displayPriority: integer("display_priority").notNull(),
	name: text().notNull(),
	logoPath: text("logo_path").notNull(),
	count: integer().default(0).notNull(),
});

export const genre = pgTable("genre", {
	id: integer().primaryKey().notNull(),
	name: text().notNull(),
	type: genreType().notNull(),
});

export const language = pgTable("language", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	count: integer().default(0).notNull(),
});

export const company = pgTable("company", {
	id: integer().primaryKey().notNull(),
	description: text().notNull(),
	headquarters: text().notNull(),
	homepage: text().notNull(),
	logoPath: text("logo_path"),
	name: text().notNull(),
	originCountry: text("origin_country").notNull(),
	parentCompany: text("parent_company"),
});

export const show = pgTable("show", {
	id: integer().primaryKey().notNull(),
	cast: text().notNull(),
	contentRating: text("content_rating"),
	createdBy: text("created_by"),
	firstAirDate: date("first_air_date", {mode: 'date'}).notNull(),
	genreId: integer("genre_id").notNull(),
	languageId: text("language_id").notNull(),
	lastAirDate: date("last_air_date", {mode: 'date'}).notNull(),
	name: text().notNull(),
	overview: text().notNull(),
	popularity: doublePrecision().notNull(),
	posterPath: text("poster_path").notNull(),
	status: text().notNull(),
	tagline: text(),
	voteAverage: doublePrecision("vote_average").notNull(),
	voteCount: integer("vote_count").notNull(),
}, (table) => [
	index("show_first_air_date_idx").using("btree", table.firstAirDate.asc().nullsLast().op("date_ops")),
	index("show_language_id_idx").using("btree", table.languageId.asc().nullsLast().op("text_ops")),
	index("show_last_air_date_idx").using("btree", table.lastAirDate.asc().nullsLast().op("date_ops")),
	index("show_name_idx").using("gin", table.name.asc().nullsLast().op("gin_trgm_ops")),
	index("show_vote_average_idx").using("btree", table.voteAverage.asc().nullsLast().op("float8_ops")),
	index("show_vote_count_idx").using("btree", table.voteCount.asc().nullsLast().op("int4_ops")),
]);

export const network = pgTable("network", {
	id: integer().primaryKey().notNull(),
	headquarters: text().notNull(),
	homepage: text().notNull(),
	logoPath: text("logo_path"),
	name: text().notNull(),
	originCountry: text("origin_country").notNull(),
	parentCompany: text("parent_company"),
});

export const syncRunLog = pgTable("sync_run_log", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }),
});

export const person = pgTable("person", {
	id: integer().primaryKey().notNull(),
	imdbId: text("imdb_id"),
	biography: text().notNull(),
	birthday: date({mode: 'date'}),
	deathday: date({mode: 'date'}),
	gender: integer().notNull(),
	knownForDepartment: text("known_for_department").notNull(),
	name: text().notNull(),
	placeOfBirth: text("place_of_birth"),
	popularity: doublePrecision().notNull(),
	profilePath: text("profile_path").notNull(),
}, (table) => [
	index("person_name_idx").using("gin", table.name.asc().nullsLast().op("gin_trgm_ops")),
]);

export const season = pgTable("season", {
	id: integer().primaryKey().notNull(),
	showId: integer("show_id").notNull(),
	airDate: date("air_date", {mode: 'date'}),
	episodeCount: integer("episode_count").notNull(),
	name: text().notNull(),
	overview: text().notNull(),
	posterPath: text("poster_path"),
	seasonNumber: integer("season_number").notNull(),
	voteAverage: doublePrecision("vote_average").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.showId],
			foreignColumns: [show.id],
			name: "season_show_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);
