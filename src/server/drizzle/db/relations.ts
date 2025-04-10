import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	credit: {
		movie: r.one.movie({
			from: r.credit.movieId,
			to: r.movie.id
		}),
		person: r.one.person({
			from: r.credit.personId,
			to: r.person.id
		}),
		show: r.one.show({
			from: r.credit.showId,
			to: r.show.id
		}),
	},
	movie: {
		credits: r.many.credit(),
		providers: r.many.mediaProvider(),
	},
	person: {
		credits: r.many.credit(),
	},
	show: {
		credits: r.many.credit(),
		providers: r.many.mediaProvider(),
		seasons: r.many.season(),
	},
	mediaProvider: {
		movie: r.one.movie({
			from: r.mediaProvider.movieId,
			to: r.movie.id
		}),
		provider: r.one.provider({
			from: r.mediaProvider.providerId,
			to: r.provider.id
		}),
		show: r.one.show({
			from: r.mediaProvider.showId,
			to: r.show.id
		}),
	},
	provider: {
		mediaProviders: r.many.mediaProvider(),
	},
	season: {
		show: r.one.show({
			from: r.season.showId,
			to: r.show.id
		}),
	},
}))