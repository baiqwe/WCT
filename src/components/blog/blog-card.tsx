import type { BlogPost } from '@/lib/blog';
import { Link } from '@tanstack/react-router';
import { formatDate } from '@/lib/formatter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function BlogCard({ post }: { post: BlogPost }) {
  const { slug } = post;

  return (
    <Link to="/blog/$slug" params={{ slug }} className="h-full">
      <Card className="h-full rounded-lg ring-1 ring-border/50 py-0 transition-all hover:ring-primary/30 dark:hover:ring-primary/60 hover:shadow-md">
        {post.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
            <img
              src={post.image}
              alt=""
              className="object-cover transition-transform hover:scale-[1.05]"
            />
          </div>
        )}
        <CardHeader className="shrink-0 flex-row items-center justify-between gap-2 px-4 pt-4 pb-0">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground text-xs font-medium capitalize">
            {post.category}
          </span>
          <span className="text-muted-foreground text-xs">
            {formatDate(new Date(post.date))}
          </span>
        </CardHeader>
        <CardContent className="flex min-h-18 flex-1 flex-col px-4 pb-4">
          <CardTitle className="line-clamp-2 text-lg font-semibold">
            {post.title}
          </CardTitle>
          {post.description && (
            <CardDescription className="mt-2 line-clamp-2 text-sm leading-relaxed">
              {post.description}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
