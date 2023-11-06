import React, {useRef, useMemo, useEffect} from "react";

/**
 * props:
 * - interval
 * - onChange
 */
function SelectInterval(props){

    const selectRef = useRef('');

    useEffect(() => {
        selectRef.current.value = props.interval;
        props.onChange({target: {id: 'interval', value: props.interval}});
    }, [props.interval])

    const SelectInterval = useMemo(() => {
        return(
            <div className="form-group">
                <label htmlFor="interval">Intervalo:</label>
                <select id="interval" ref={selectRef} className="form-select" onChange={props.onChange}>
                    <option value="1m">1 minuto</option>
                    <option value="3m">3 minutos</option>
                    <option value="5m">5 minutos</option>
                    <option value="15m">15 minutos</option>
                    <option value="30m">30 minutos</option>
                    <option value="1h">1 hora</option>
                    <option value="2h">2 horas</option>
                    <option value="4h">4 horas</option>
                    <option value="6h">6 horas</option>
                    <option value="8h">8 horas</option>
                    <option value="12h">12 horas</option>
                    <option value="1d">1 dia</option>
                    <option value="3d">3 dias</option>
                    <option value="1w">1 semana</option>
                    <option value="1M">1 mês</option>
                </select>
            </div>
        )
    }, [props.interval])

    return SelectInterval;
}

export default SelectInterval;