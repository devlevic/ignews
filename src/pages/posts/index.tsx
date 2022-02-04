import { GetStaticProps } from "next";
import Head from "next/head";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import styles from "./styles.module.scss";
import Link from "next/link";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};
export default Posts;

interface PrismicResponse {
  title: string;
  content: {
    type: string;
    text: string;
  }[];
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query<PrismicResponse>("", {
    pageSize: 100,
    lang: "*",
    page: 1,
  });

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "",
      updatedAt: new Date(post.last_publication_date).toLocaleString("pt-br", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  return {
    props: {
      posts,
    },
  };
};
