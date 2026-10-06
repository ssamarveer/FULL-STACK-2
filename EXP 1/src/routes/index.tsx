import { createFileRoute } from "@tanstack/react-router";
import { PostComposer } from "@/components/composer/PostComposer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Post Composer — Multi-Platform Social Publisher" },
      {
        name: "description",
        content:
          "Compose posts once and publish across Twitter, Instagram, LinkedIn and Facebook with real-time character and hashtag validation.",
      },
      { property: "og:title", content: "Post Composer — Multi-Platform Social Publisher" },
      {
        property: "og:description",
        content:
          "Real-time multi-platform post composer with live character counts, hashtag detection and platform previews.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PostComposer />;
}
