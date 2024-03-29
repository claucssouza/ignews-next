import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RichText } from "prismic-dom";
import { useEffect } from 'react';
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';


interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

const PostPreview = ({ post }: PostPreviewProps) => {
    const {data} = useSession();
    const router = useRouter()

    useEffect(() => {
        if (data) {
            router.push(`posts/${post.slug}`)
        }
    }, [data]);

    return (
        <>
            <Head>
                <title>{post.title} Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="/">
                            <a>Subscrive now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export default PostPreview;

export const getStaticPaths: GetStaticPaths =  async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug } = params;
    const prismic = getPrismicClient();
    const response = await prismic.getByUID('post', String(slug), {});
    const post = {
        slug,
        title: RichText.asText(response.data),
        content: RichText.asHtml(response.data),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    };

    return {
        props: {
            post
        },
        revalidate: 60 * 30 //30 minutos
    }
}