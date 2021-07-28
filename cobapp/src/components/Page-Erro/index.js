import React from 'react'

export const PageError = () => (
	<div className="container-fluid">
		<div className="AlertCob-error alert-danger" role="alert">
			<h3 className='Font-alert-error'>
				Oi! Você está utilizando a nossa aplicação por um meio que não contém todos os parâmetros de segurança necessários.
			</h3>
			<h3 className='Font-alert-error'>
				Cheque isso e tente novamente.<br />
				Até a próxima!
			</h3>
		</div>		
	</div>			
)