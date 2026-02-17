import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import Container from '@/components/layout/container';
import { MarkdownBody } from '@/components/page/markdown-body';
import { getPostBySlug } from '@/lib/blog';
import { websiteConfig } from '@/config/website';
import { messages } from '@/config/messages';
import { IconArrowLeft } from '@tabler/icons-react';

export const Route = createFileRoute('/blog/$slug')({
  component: BlogPostPage,
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = getPostBySlug(slug);

  if (!websiteConfig.blog?.enable) {
    return (
      <Container className="py-16">
        <p className="text-center text-muted-foreground">
          {messages.blog.disabled}
        </p>
      </Container>
    );
  }

  if (!post) {
    throw notFound();
  }

  const dateFormatted = formatDate(post.date);

  return (
    <div className="flex flex-col gap-8 pb-16">
      <Container className="px-4">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            search={{ page: 1 }}
            className="mb-6 inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
          >
            <IconArrowLeft className="size-4" />
            {messages.blog.allPosts}
          </Link>

          <article>
            {/* Metadata: category, date */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
              <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium capitalize">
                {post.category}
              </span>
              <time dateTime={post.date}>{dateFormatted}</time>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                {post.description}
              </p>
            )}

            <div className="mt-8">
              <MarkdownBody content={post.content} />
            </div>
          </article>
        </div>
      </Container>
    </div>
  );
}
