import React, { useState } from 'react'
import axios from '../../../axios'
import Head from 'next/head'
import RequireAuthentication from '../../HOC/requireAuthentication'

import {
    PageContainer,
    Container,
    ActionsTd
} from '../../styles/pages/products'

import Table from '../../components/table'
import { NextPageContext } from 'next'
import product, { ImageProduct } from '../../components/product'
import { StonesAndShapes } from '../shop/products'
import Link from 'next/link'
import { MdEdit } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import ConfirmModal from '../../components/confirmModal'
import { BsImageFill } from 'react-icons/bs'
import { Badge } from '../../components/badge'

export interface Product {
    sold: boolean
    _id: string
    productType: StonesAndShapes
    type: StonesAndShapes
    stock_id: number
    name: string
    description: string
    price: number
    stone: StonesAndShapes
    stoneWeigth: number
    diamondWeigth: number
    shape: StonesAndShapes
    images: ImageProduct[]
    metal: StonesAndShapes
    visible: boolean
}

interface Props {
    products: Product[]
}

const productsPage = ({ products: productsFromProps }: Props) => {
    const [products, setProducts] = useState(productsFromProps)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmModalId, setConfirmModalId] = useState(null)
    const [confirmModalRow, setConfirmModalRow] = useState(null)
    const [confirmModalError, setConfirmModalError] = useState(null)

    const openConfirmModal = (id: string, row) => {
        setConfirmModalId(id)
        setShowConfirmModal(true)
        setConfirmModalRow(row)
    }

    const closeConfirmModal = () => {
        setConfirmModalId(null)
        setShowConfirmModal(false)
        setConfirmModalError(null)
    }

    const handleDelete = async () => {
        try {
            const response = await axios.delete('/product/' + confirmModalId)
            const productsCopy = [...products]
            productsCopy.splice(confirmModalRow, 1)
            setProducts(productsCopy)

            setConfirmModalId(null)
            setShowConfirmModal(false)
        } catch (e) {
            setConfirmModalError(e.response.data.error)
        }
    }

    const columns = React.useMemo(
        () => [
            {
                Header: ' ',
                columns: [
                    {
                        Header: 'Id do Estoque',
                        accessor: 'stock_id'
                    },
                    {
                        Header: 'Status',
                        accessor: 'sold',
                        Cell: props => (
                            <Badge type="sold" sold={props.value}>
                                {props.value ? 'Vendido' : 'Em estoque'}
                            </Badge>
                        )
                    },
                    {
                        Header: 'Visível',
                        accessor: 'visible',
                        Cell: props => {
                            console.log(props)
                            return (
                                <Badge type="visible" visible={props.value}>
                                    {props.value ? 'Visível' : 'Escondido'}
                                </Badge>
                            )
                        }
                    },
                    {
                        Header: 'Tipo',
                        accessor: 'type'
                    },
                    {
                        Header: 'Nome',
                        accessor: 'name'
                    },
                    {
                        Header: 'Preço',
                        accessor: 'price'
                    },
                    {
                        Header: 'Pedra',
                        accessor: 'stone'
                    },
                    {
                        Header: 'Ações',
                        accessor: '_id',
                        Cell: props => (
                            <ActionsTd>
                                <Link href={'/products/images/' + props.value}>
                                    <a className="imgg">
                                        <BsImageFill fill="green" />
                                    </a>
                                </Link>
                                <Link href={'/products/edit/' + props.value}>
                                    <a>
                                        <MdEdit />
                                    </a>
                                </Link>

                                <FaTrash
                                    onClick={() =>
                                        openConfirmModal(
                                            props.value,
                                            props.row.index
                                        )
                                    }
                                />
                            </ActionsTd>
                        )
                    }
                ]
            }
        ],
        [products]
    )

    const data = React.useMemo(
        () =>
            products.map(product => {
                return {
                    _id: product._id,
                    sold: product.sold,
                    visible: product.visible,
                    // productType: product.productType.name,
                    type: product.type ? product.type.name : 'Gema',
                    stock_id: product.stock_id,
                    name: product.name,
                    price: product.price,
                    stone: product.stone ? product.stone.name : product.stone,
                    stoneWeigth: product.stoneWeigth,
                    diamondWeigth: product.diamondWeigth,
                    shape: product.shape.name,
                }
            }),
        [products]
    )

    return (
        <>
            <Head>
                <title>Dunna - Produtos</title>
            </Head>
            <PageContainer>
                <Container>
                    <Table columns={columns} data={data} />
                </Container>
                <ConfirmModal
                    title="Tem certeza que deseja excluir?"
                    show={showConfirmModal}
                    closeModal={closeConfirmModal}
                    confirmHandler={handleDelete}
                    error={confirmModalError}
                />
            </PageContainer>
        </>
    )
}

productsPage.getInitialProps = async (
    context: NextPageContext,
    token: string
) => {
    const { data: products } = await axios.get('/productsall', {
        headers: {
            Cookie: `token=${token};`
        }
    })

    return {
        products

        // will be passed to the page component as props
    }
}

export default RequireAuthentication(productsPage, true)
