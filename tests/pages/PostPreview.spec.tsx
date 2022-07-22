import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession} from 'next-auth/react'
import { useRouter } from 'next/router'
import Post, { getStaticProps, getStaticPaths } from '../../src/pages/posts/preview/[slug]'
import { getPrismicClient } from '../../src/services/prismic'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../src/services/prismic')

const post = { 
    slug: 'my-new-post', 
    title: 'My New Post', 
    excerpt: 'Post excerpt', 
    content: '<p>Post content</p>', 
    updatedAt: '10 de Abril' 
}


describe('Posts/preview Page', () => {
    it('should render correctly', () => {
        const  useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

        render(<Post post={post} />)
        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
    })

    it('should redirect user to completed post if user is subscribed', async () => {
        const getSessionMocked = mocked(useSession)
        const useRouterMocked = mocked(useRouter)
        const pushMock = jest.fn()

        getSessionMocked.mockReturnValueOnce({
            data: {
                activeSubscription: 'fake-active-subscription'
            }
        } as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)
        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('should load initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

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

        const response = await getStaticProps({ params: { slug: 'my-new-post' }})

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

    it('should return fallback blocking and empty paths', async () => {
        const response = await getStaticPaths({})

        expect(response).toEqual({
            paths: [],
            fallback: 'blocking'
        })
    })
})