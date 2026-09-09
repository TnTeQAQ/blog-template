import type { ReactNode } from 'react';
import HomeView from '../pages/HomeView';
import PostListView from '../pages/PostListView';
import LabView from '../pages/LabView';
import PostView from '../pages/PostView';
import NotFoundView from '../pages/NotFoundView';
import { getArchivePosts, getPost, getPosts } from '../lib/content';

/**
 * Single-root page registry. Views are keyed by pageId (not URL paths); post
 * pages are dynamic `post:<slug>` ids derived from the content index,
 * site-level pages (about) render through the same post page, and both the
 * archive and tag pages are the same unified post-list page (`PostListView`)
 * fed with different data — the archive (excluding `hidden`-tagged posts)
 * vs. a tag-filtered subset.
 */
export function renderPage(pageId: string): ReactNode {
  if (pageId === 'home') return <HomeView />;
  if (pageId === 'archive') {
    // posts tagged `hidden` stay out of the archive but remain reachable
    // through their tag pages
    return <PostListView title="Archive" posts={getArchivePosts()} />;
  }
  if (pageId === 'about') return <PostView slug="about" />;
  if (pageId === 'lab') return <LabView />;
  if (pageId.startsWith('post:')) {
    const slug = pageId.slice('post:'.length);
    if (getPost(slug)) return <PostView slug={slug} />;
  }
  if (pageId.startsWith('tag:')) {
    const tag = pageId.slice('tag:'.length);
    if (tag) {
      return (
        <PostListView
          title={`Tag: ${tag}`}
          backFallback="archive"
          posts={getPosts().filter((post) => post.tags.includes(tag))}
        />
      );
    }
  }
  if (pageId.startsWith('not-found:')) {
    return <NotFoundView pageId={pageId.slice('not-found:'.length)} />;
  }
  return <NotFoundView pageId={pageId} />;
}

export function getPageTitle(pageId: string): string {
  if (pageId === 'home') return 'Blog';
  if (pageId === 'archive') return 'Archive';
  if (pageId === 'about') return 'About';
  if (pageId === 'lab') return 'Lab';
  if (pageId.startsWith('post:')) {
    const post = getPost(pageId.slice('post:'.length));
    if (post) return post.title;
  }
  if (pageId.startsWith('tag:')) return `Tag: ${pageId.slice('tag:'.length)}`;
  return 'Not Found';
}
