import React, { useEffect, useState } from 'react';
import Menu from '../../components/menu/Menu';
import NewOrderButton from '../../components/menu/NewOrder/NewOrderButton';
import NewOrderModal from '../../components/menu/NewOrder/NewOrderModal';
import { getBalance } from '../../services/ExchangeService';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { getOrders } from '../../services/OrdersService';
import OrderRow from './OrderRow';

function Orders() {

    function useQuery(){
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();

    const history = useHistory();

    const [balances, setBalances] = useState({});
    const [orders, setOrders] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(parseInt(query.get('page')));

    function errorProcedure(err){
        if (err.response && err.response.status === 401) return history.push('/');
            console.error(err);
    }

    function getBalanceCall(token){
        getBalance(token)
        .then(info => {
            const balances = Object.entries(info).map(item => {
                return {
                    symbol: item[0],
                    available: item[1].available,
                    onOrder: item[1].onOrder
                }
            })
            setBalances(balances);
        })
        .catch(err => 
            errorProcedure(err))
    }

    function getOrdersCall(token){
        getOrders('', page || 1, token)
            .then(result => {
                setOrders(result.rows);
                setCount(result.count);
            })
            .catch(err => 
                errorProcedure(err))
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        getBalanceCall(token);
        getOrdersCall(token);
    }, []);

    function onOrderSubmit(order){
        history.go(0);
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4" >
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Ordens</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        <div className="d-inline-flex align-items-center">
                            <NewOrderButton />
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Símbolo</th>
                                <th className="border-gray-200">Data</th>
                                <th className="border-gray-200">Compra/Venda</th>
                                <th className="border-gray-200">Qtd</th>
                                <th className="border-gray-200">Net</th>
                                <th className="border-gray-200">Status</th>
                                <th className="border-gray-200">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders ? orders.map(order => (
                                    <OrderRow key={order.clientOrderId} data={order} />
                                ))
                                : <React.Fragment></React.Fragment>
                            }
                        </tbody>
                    </table>
                </div>
            </main>
            <NewOrderModal wallet={balances} onSubmit={onOrderSubmit} />
        </React.Fragment>
    )
}

export default Orders;