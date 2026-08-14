import type { MetadataRoute } from 'next';
import { routes } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import { boats, experiences, waters, trips, departures, articles } from '@/lib/data';

const STATIC_PATHS = [
  routes.home(),
  routes.experiences(),
  routes.destinations(),
  routes.boats(),
  routes.departures(),
  routes.journal(),
  routes.ourStory(),
  routes.faq(),
  routes.contact(),
  routes.policies(),
  routes.partners(),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...experiences.map((e) => routes.experience(e.slug)),
    ...waters.map((w) => routes.destination(w.slug)),
    ...boats.map((b) => routes.boat(b.slug)),
    ...trips.map((t) => routes.trip(t.slug)),
    ...departures.map((d) => routes.departure(d.id)),
    ...articles.map((a) => routes.article(a.slug)),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
