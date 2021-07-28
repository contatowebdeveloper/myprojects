import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale  } from 'react-datepicker'
import ptbr from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import MaskedTextInput from 'react-text-mask'

registerLocale("ptbr", ptbr)

export default function DateInput(props) {
    const [ startDate, setStartDate ] = useState('')
    const [ enabledClear, setEnabledClear ] = useState(false)
    const { placeholder, clearValueDate } = props

    useEffect(() => {
        if(clearValueDate){
            setStartDate('')
            setEnabledClear(false)
        }
    }, [clearValueDate, props]);

    function handleChange(date) {
        
		if(date){
            setStartDate(date)
            setEnabledClear(true)
		} else {
            setStartDate('')
            setEnabledClear(false)
		}
    }

    return(
        <div className="DateCob-input">				
            <DatePicker
                id={props.id}
                isClearable={enabledClear}
                placeholderText={placeholder}
                selected={startDate}
                onChange={handleChange}
                className="DateCob-picker"
                dateFormat="dd/MM/yyyy"
                locale="ptbr"
                customInput={
                    <MaskedTextInput
                        type="text"
                        mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
                    />
                }
            />			
        </div>
    )
}