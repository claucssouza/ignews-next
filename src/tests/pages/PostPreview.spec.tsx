import { screen, render } from '@testing-library/react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';


const posts = {
    slug: 'my-new-post',
    title: 'My new Post',
    content: '<p>Post excerpt</p>',
    updatedAt: 'January, 17'
};
jest.mock('next-auth/react');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Post Preview page', () => {
    it('renders correctly', () => {
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' });
        render(<PostPreview post={posts} />);
        expect(screen.getByText('My new Post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
    });

    it('redirects user to full post when user is subscribed', async () => {
        const useSessionMocked = mocked(getSession);
        const useRouterMocked = mocked(useRouter);
        const pushMock = jest.fn();
        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false
        ] as any);

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any);

        render(<PostPreview post={posts} />);
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
    });

    it('loads initial data', async () => {        
        const getPrismiscClientMocked = mocked(getPrismicClient);
        getPrismiscClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'My new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post content' }
                    ]
                },
                last_publication_date: '04-01-2021'
            })
        } as any);        

        const response = await getStaticProps({
            params: { slug: 'my-new-post' }
        } as any);

        expect(response).toEqual({
            props: {
                post: {
                    slug: 'my-new-post',
                    title: 'My new post',
                    content: '<p>Post content</p>',
                    updatedAt: '01 de abril de 2021'
                }               
            },
            revalidate: 60 * 30
        });
    })
});