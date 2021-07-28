# Documento para configurar o ambiente de produção e homologação dos projetos CobApp e API

### 1. Requisitos mínimos para o Servidor:
##### - Distribuição CentOS 7
##### - PHP 7.2.24
##### - Drivers sqlsrv e pdo_sqlsrv para conexão com banco MSSQL
##### - Apache 2.4.6 (CentOS)
#
#
### 2. Dados para se conectar ao servidor:
#####	NOTA: Você pode utilizar o Bitvise para fazer a conexão por SSH e SFTP.
#
##### 2.1	Servidor de produção:
	IP: 192.168.100.31
##### 2.2	Servidor de teste:
	IP: 192.168.100.32
##### 2.3	Servidor de homologação:
	IP: 192.168.100.33
##### 2.4 Dados comuns aos dois ambientes:
	Porta: 22
	Usuario: root
	Senha: Schulzeap!2018

### NOTA: Deixe o SELinux em modo permissivo:
> 1. Para isso, execute o comando: vi /etc/sysconfig/selinux
> 2. Setar o parâmetro SELINUX=permissive
> 3. Salve o arquivo e saia, para isso, pressione a tecla ESC, Shift + :, digite wq e pressione a tecla ENTER
> 4. Digite o comando setenforce 0
> 5. Para consultar o status do SELinux, digite sestatus
> 6. Parar o Firewall (*temporariamente): systemctl stop firewalld
(* temporário porque na época em que foi montado o servidor a equipe de infra não tinha ajustado as liberações adequadas para esse projeto, por isso, no nosso caso, desabilitamos para subir os projetos a fim de homologarmos)


### 3. Instalar os drivers sqlsrv e o pdo_sqlsrv:

Essa instalação consiste em instalar os drivers que equivalem-se para a distribuição Red Hat 7

As orientações a seguir são uma transcrição do site da microsoft, os links estão no final deste documento.

Observação: Para instalar o PHP 7.1 ou 7.2, substitua remi-php73 por remi-php71 ou remi-php72, respectivamente, nos comandos a seguir.

##### 3.1. Etapa 1. Instalar o PHP/Atualizá-lo

sudo su
wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
wget https://rpms.remirepo.net/enterprise/remi-release-7.rpm
rpm -Uvh remi-release-7.rpm epel-release-latest-7.noarch.rpm
subscription-manager repos --enable=rhel-7-server-optional-rpms
yum install yum-utils
yum-config-manager --enable remi-php72
yum update
yum install php php-pdo php-xml php-pear php-devel re2c gcc-c++ gcc

##### 3.2. Etapa 2. Instalar pré-requisitos

sudo su

curl https://packages.microsoft.com/config/rhel/7/prod.repo > /etc/yum.repos.d/mssql-release.repo

exit
sudo yum remove unixODBC-utf16 unixODBC-utf16-devel #to avoid conflicts
sudo ACCEPT_EULA=Y yum install msodbcsql17

sudo yum install unixODBC-devel

##### 3.3. Instalar os drivers PHP para Microsoft SQL Server

sudo pecl install sqlsrv
sudo pecl install pdo_sqlsrv
sudo su
echo extension=pdo_sqlsrv.so >> `php --ini | grep "Scan for additional .ini files" | sed -e "s|.*:\s*||"`/pdo_sqlsrv.ini
echo extension=sqlsrv.so >> `php --ini | grep "Scan for additional .ini files" | sed -e "s|.*:\s*||"`/sqlsrv.ini
exit

sudo yum install php-sqlsrv

Se tiver problemas com a Etapa 3, para instalar os drivers com o PECL, veja esse link e siga as instruções:
https://github.com/Microsoft/msphpsql/issues/726

Pode ser necessário instalação do PEAR / PECL no servidor para possibilitar a instalação dos drivers conforme a Microsoft orienta.
O Devtoolset que está no servidor pode precisar ser atualizado para que a instalação dos drivers possam funcionar corretamente.

Execute os comandos abaixo para atualizar o devtoolset:

	sudo yum install centos-release-scl
	sudo yum install devtoolset-7
	scl enable devtoolset-7 bash

Após a instalação dos drivers, dê continuidade desde a etapa 3.3 em diante.

##### 3.4.  Reiniciar o Apache

systemctl restart httpd


### 4. Configurando o ambiente de produção e homologação

##### 4.1. Os domínios para o servidor de produção são: 
	cobapp.schulze.com.br:3000	- CobApp
	api.schulze.com.br:8000		- API

##### 4.2. Os domínios para o servidor de homologação são:
	cobapp-homolog.schulze.com.br:3000	- CobApp
	api-homolog.schulze.com.br:8000		- API

##### NOTA: Para configurar os VirtualHost's no ambiente de homologação, basta trocar as referências do ServerName e ServerAlias dos respectivos domínios, adicionando o prefixo -homolog, no caso:
	cobapp-homolog.schulze.com.br
	api-homolog.schulze.com.br

##### 4.3. Crie os diretórios dos respectivos projetos:
	mkdir /var/www/cobapp
	mkdir /var/www/api

##### 4.4. Dê permissão para o usuário do apache nos diretórios cobapp e api:
	chown -R apache:apache /var/www/cobapp
	chown -R apache:apache /var/www/api

##### 4.5. Dê permissão total para o proprietário, e permissão de leitura e escrita para membros do grupo apache e outros:
	chmod -R 755 /var/www

##### 4.6. Crie os diretórios sites-available e sites-enabled, necessários para a configuração dos "VirtualHost" dos respectivos projetos:
	mkdir /etc/httpd/sites-available
	mkdir /etc/httpd/sites-enabled

##### 4.7. Crie um arquivo com o nome api-schulze.conf dentro de /etc/httpd/sites-available:
	vi api-schulze.conf e pressione a tecla "Insert"

##### 4.8. Coloque no arquivo a seguinte informação:
	<VirtualHost *:8000>
		ServerName api.schulze.com.br
		ServerAlias api.schulze.com.br
		DocumentRoot /var/www/api
		ErrorLog /var/www/api/error.log
		CustomLog /var/www/api/requests.log combined
		<Directory "/var/www/api">
			AllowOverride All
			Options FollowSymLinks Includes Indexes MultiViews 
		</Directory>
	</VirtualHost>

##### 4.9. Salve o arquivo e saia:
> Pressione a tecla ESC e digite :wq para salvar e sair do arquivo.

##### 4.10. Crie um link simbólico para o arquivo api-schulze.conf:
	ln -s /etc/httpd/sites-available/api-schulze.conf /etc/httpd/sites-enabled/api-schulze.conf

##### 4.11. Crie um arquivo com o nome cobapp.conf dentro de /etc/httpd/sites-available:
	vi cobapp.conf e pressione a tecla "Insert"

##### 4.12. Colocar no arquivo a seguinte informação:
	<VirtualHost *:3000>
		ServerName cobapp.schulze.com.br
		ServerAlias cobapp.schulze.com.br
		DocumentRoot /var/www/cobapp
		ErrorLog /var/www/cobapp/error.log
		CustomLog /var/www/cobapp/requests.log combined
		<Directory "/var/www/cobapp">
			AllowOverride All
			Options FollowSymLinks Includes Indexes MultiViews 
		</Directory>
	</VirtualHost>

##### 4.13. Salve o arquivo e saia:
> Pressione a tecla ESC e digite :wq para salvar e sair do arquivo.

##### 4.14. Crie um link simbólico para o arquivo:
	ln -s /etc/httpd/sites-available/cobapp.conf /etc/httpd/sites-enabled/cobapp.conf

##### 4.15. Edite o httpd.conf:
	vi /etc/httpd/conf/httpd.conf:

##### 4.16. Adicione no httpd.conf as portas 3000 e 8000 para serem escutadas pelo servidor:
	Listen 3000
	Listen 8000

##### 4.17. Adicione no final do httpd.conf para ler o diretório dos hosts virtuais: 
	IncludeOptional /etc/httpd/sites-enabled/*.conf

##### 4.18. Reinicie o servidor Apache:
	sudo systemctl restart httpd para reiniciar o apache.

### 5.	Adicionando os projetos nas respectivas pastas no servidor:
##### 5.1. Acesse o projeto API que está no SVN através do endereço:
	https://192.168.100.145/svn/Intraapps/trunk/api
##### 5.2. Faça o Checkout da pasta API para sua máquina local.
##### 5.3. Envie o conteúdo desta pasta para o diretório /var/www/api do respectivo servidor via SFTP.
##### 5.4. Acesse o projeto build que está no SVN através do endereço:
	https://192.168.100.145/svn/Intraapps/trunk/build
##### 5.5. Faça o Checkout da pasta build para sua máquina local.
##### 5.6. Envie o conteúdo desta pasta para o diretório /var/www/cobapp do respectivo servidor via SFTP.

### 6 Conclusão:
> Pronto! As configurações necessárias para subir o ambiente estão concluídas.
Para testar se está tudo conforme o esperado você tem três formas de testar:
##### 6.1. No seu navegador digite o endereço do cobapp:
	http://cobapp-homolog.schulze.com.br:3000
>Para esse acesso, sem os parâmetros adequados do Cobsystem, será exibido a tela de carregando a aplicação com a informação de que esse acesso precisa de parâmetros válidos.
##### 6.2. No seu navegador digite o endereço da api:
	http://api-homolog.schulze.com.br:8000
> Você verá a mensagem "API SCHULZE...!"
##### 6.3. Entre no Cobsystem com parâmetro de ambiente 0 ou 1 (Ambiente d e Produção / Homologação)
> Ao acessar uma ficha pelo consulta principal, o web browser deverá carregar o projeto do respectivo domínio.

### Links de referência para instalação dos drivers:

https://docs.microsoft.com/pt-br/sql/connect/php/installation-tutorial-linux-mac?view=sql-server-ver15#installing-the-drivers-on-red-hat-7

### Link para a instalação do driver para MS SQL

https://docs.microsoft.com/pt-br/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=sql-server-ver15
