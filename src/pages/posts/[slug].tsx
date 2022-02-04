import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import styles from "./post.module.scss";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    updatedAt: string;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
};
export default Post;

interface PrismicResponse {
  title: string;
  content: {
    type: string;
    text: string;
  }[];
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID<PrismicResponse>(
    "publication",
    String(slug),
    {}
  );

  const post = {
    slug,
    title: RichText.asText(response?.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleString(
      "pt-br",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: { post },
  };
};
