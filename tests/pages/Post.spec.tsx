import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../../src/pages/posts/[slug]'
import { getPrismicClient } from '../../src/services/prismic'

jest.mock('next-auth/react')
jest.mock('../../src/services/prismic')

const post = { 
    slug: 'my-new-post', 
    title: 'My New Post', 
    excerpt: 'Post excerpt', 
    content: '<p>Post content</p>', 
    updatedAt: '10 de Abril' 
}


describe('Posts/[slug] Page', () => {
    it('should render correctly', () => {
        render(<Post post={post} />)
        expect(screen.getByText("My New Post")).toBeInTheDocument()
    })

    it('should redirect user if no subscription is fund', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: {
                    destination: '/',
                    permanent: false
                }
            })
        )
    })

    it('should load initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        {
                            type: 'heading', text: 'My new post'
                        }
                    ],
                    content: [
                        {
                            type: 'paragraph', text: 'Post content'
                        }
                    ]
                },
                last_publication_date: '04-01-2022'
            })
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'my-new-post'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My new post',
                        content: '<p>Post content</p>',
                        updatedAt: '01 de abril de 2022'       
                    }
                }
            })
        )
    })
})