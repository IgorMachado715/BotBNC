import React from "react";

function LineChart() {
    return (
        <div className="row">
            <div className="col-12 mb-4">
                <div className="card bg-yellow-100 border-0 shadow">
                    <div className="card-header d-sm-flex flex-row align-items-center flex-0">
                        <div className="d-block mb-3 mb-sm-0">
                            <div className="fs-5 fw-normal mb-2">Valor de Venda</div>
                            <h2 className="fs-3 fw-extrabold">R$10,567</h2>
                            <div className="small mt-2">
                                <span className="fw-normal me-2">Atualmente</span>
                                <span className="fas fa-angle-up text-success"></span>
                                <span className="text-success fw-bold">10.57%</span>
                            </div>
                        </div>
                        <div className="d-flex ms-auto">
                            <a href="/" className="btn btn-secondary text-dark btn-sm me-2">Mês</a>
                            <a href="/" className="btn btn-dark btn-sm me-3">Semana</a>
                        </div>
                    </div>
                    <div className="card-body p-2">
                        <div className="ct-chart-sales-value ct-double-octave ct-series-g"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LineChart;