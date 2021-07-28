import React from 'react'

export default function Button(props) {

    const { className, id, textButton, modalname, name, onClick, tagI, tagSpan} = props

    return (
        <button 
            id={id}
            className={className}
            modalname={modalname}
            name={name}
            onClick={onClick}
        >
        {textButton !== undefined ? textButton : tagSpan ? tagSpan : tagI}
        </button>
    )
}