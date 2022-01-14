import { screen, render } from '@testing-library/react';
import { getSession } from 'next-auth/react';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';


const posts = {
    slug: 'my-new-post',
    title: 'My new Post',
    content: '<p>Post excerpt</p>',
    updatedAt: 'January, 17'
};
jest.mock('next-auth/react');
jest.mock('../../services/prismic');

describe('Post pages', () => {
    it('renders correctly', () => {
        render(<Post post={posts} />)
        expect(screen.getByText('My new Post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    });

    it('redirects user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession);
        getSessionMocked.mockResolvedValueOnce(null);
        const response = await getServerSideProps({
            params: { slug: 'my-new-post' }
        } as any);

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    });

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession);
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
        } as any)
        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);

        const response = await getServerSideProps({
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
            }
        });
    })
});