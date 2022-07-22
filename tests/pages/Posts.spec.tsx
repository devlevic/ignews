import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import Posts, { getStaticProps } from '../../src/pages/posts'
import { getPrismicClient } from '../../src/services/prismic'

jest.mock('../../src/services/prismic')

const posts = [
    { slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '10 de Abril' }
]

describe('Posts page', () => {
    it('should render correctly', () => {
        render(<Posts posts={posts} />)
        expect(screen.getByText("My New Post")).toBeInTheDocument()
    })

    it('should load initial data', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    { 
                        uid: 'my-new-post',
                        data: {
                            title: [
                                {
                                    type: 'heading', text: 'My new post'
                                }
                            ],
                            content: [
                                {
                                    type: 'paragraph', text: 'Post excerpt'
                                }
                            ]
                        },
                        last_publication_date: '04-01-2022'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        excerpt: 'Post excerpt',
                        updatedAt: '01 de abril de 2022'
                    }]
                }
            })
        )
    })
    
    it('should load initial data without excerpt', async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    { 
                        uid: 'my-new-post',
                        data: {
                            title: [
                                {
                                    type: 'heading', text: 'My new post'
                                }
                            ],
                            content: [
                                {
                                    type: 'paragraph', text: undefined
                                }
                            ]
                        },
                        last_publication_date: '04-01-2022'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({})

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My new post',
                        excerpt: '',
                        updatedAt: '01 de abril de 2022'
                    }]
                }
            })
        )
    })
})