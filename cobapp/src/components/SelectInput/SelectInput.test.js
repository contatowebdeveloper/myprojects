import React from 'react'
import { shallow } from '../../enzyme'
import TestRenderer from 'react-test-renderer'
import { render, fireEvent } from '@testing-library/react'
import { toBeInTheDocument } from '@testing-library/jest-dom'

import SelectInput from './'

expect.extend({toBeInTheDocument})

describe("Render SelectInput", () => {
    it('render correctly select component and create a snapshot', () => {
        const propsOptions = ["Ajuizamento", "Busca e Apreensão"]

        const wrapper = shallow(<SelectInput />)
        expect(wrapper.find('Select').length).toBe(1)
        const SelectInputComponent = TestRenderer.create(<SelectInput listValue={propsOptions} />).toJSON()
        expect(SelectInputComponent).toMatchSnapshot()
    })

    it('testing SelectInput prop Option', () => {
        jest.mock('./index', () => ({ options, value, onChange }) => {
            function handleChange(event) {
                const option = options.find(
                    option => option.value === event.currentTarget.value
                )
                onChange(option)
            }
            return (
                <select data-testid="select" value={value} onChange={handleChange}>
                {options.map(({ label, value }) => (
                    <option key={value} value={value}>
                    {label}
                    </option>
                ))}
                </select>
            )
        })
    })

    test("Test selectInput ", () => {
        const propsOptions = ["Ajuizamento", "Busca e Apreensão"]

        const testMessage = 'Selecione o(s) Status'
        const { getByText, getByTestId } = render(<SelectInput listValue={propsOptions} placeholder='Selecione o(s) Status' data-testid="select" />);
        expect(getByText(testMessage)).toBeInTheDocument()
        fireEvent.change(getByTestId("select"), { target: { value: "Ajuizamento" } })
        expect(getByText("Ajuizamento")).toBeInTheDocument()
    })
})