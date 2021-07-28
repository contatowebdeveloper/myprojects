import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import { unSelectAll } from '../../utils'
import LoadingOverlay from 'react-loading-overlay'

class Pager extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage : 1,
      loading : true,
      visibleNext : true,
      visiblePrev : true,
      disabledNext: false,
      disabledPrev: false
    }

    this.setStatePagerClickArrow = this.setStatePagerClickArrow.bind(this)
    this.changePageClickArrow = this.changePageClickArrow.bind(this)
    this.setStateButtonPager = this.setStateButtonPager.bind(this)
    this.hiddenOrVisibleArrow = this.hiddenOrVisibleArrow.bind(this)
    this.clean = this.clean.bind(this)
  }

  componentDidMount = () => {
    this.setState({
      currentPage: 1,
      visiblePrev: false,
      loading: false
    })
  }
  
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if( nextProps.ressetPaginator ){
      this.setState({
        currentPage: 1,
        visiblePrev: false,
        visibleNext : true,
        loading: false
      })
    }
  }

  setStatePagerClickArrow = (groupPaginator, stateCurrentPage, id) => {
    let currentPage = id === 'btnPageNext' ? (stateCurrentPage + 1) : (stateCurrentPage - 1)    
    //setTimeout(() => { 
      this.changePageClickArrow(groupPaginator, currentPage) 
    //}, 100)
  }

  changePageClickArrow = (groupPaginator, stateCurrentPage) => {
    var offset = []
    groupPaginator.map((paginator) => {
      const pageFiltered = paginator.filter(n => n.page === (stateCurrentPage))[0]
      if(pageFiltered){ 
        offset.push(pageFiltered.offset)
      }

      return( offset )
    })

    this.hiddenOrVisibleArrow(stateCurrentPage, groupPaginator[0].length)
    this.props.callbackList(this.props.listOfChecked, offset[0], stateCurrentPage, this.props.checkBackupCall)
  }

  hiddenOrVisibleArrow = (currentPage, paginatorLength) => {
    
    if(currentPage === 1 && paginatorLength === currentPage){
      this.setState({        
        currentPage: currentPage,
        visiblePrev: false,
        visibleNext: false,
        loading: false
      })
    }else if(currentPage === 1 && paginatorLength > 1){
      this.setState({
        currentPage: currentPage,
        visiblePrev: false,
        visibleNext: true,
        loading: false
      })
    }else if(currentPage > 1 && currentPage < paginatorLength){
      this.setState({
        currentPage: currentPage,
        visiblePrev: true,
        visibleNext: true,
        loading: false
      })
    }else if(currentPage === paginatorLength && paginatorLength > 1){
      this.setState({
        currentPage: currentPage,
        visiblePrev: true,
        visibleNext: false,
        loading: false
      })
    }    
  }

  setStateButtonPager = (currentPage, paginatorLength) => {
    this.hiddenOrVisibleArrow(currentPage, paginatorLength)    
  }

  clean = () => { unSelectAll() }

  render() {
    const { callbackList, totalRegistries, listOfChecked, totalLimiter, groupLimiter } = this.props    
    const { currentPage, visiblePrev, visibleNext, loading } = this.state
    const pageNumbers = []
    // Calculando offset
    if (totalRegistries) {
      var offset = 0
      for (let i = 1; i <= Math.ceil(totalRegistries / totalLimiter); i++) {
        pageNumbers.push({page : i, offset : offset})
        offset = offset + totalLimiter
      }
    }

    const nLimiter = pageNumbers.length
    let start = 0
    let end = nLimiter

    const nGroupPaginator = pageNumbers.length > nLimiter ? Math.ceil(pageNumbers.length / nLimiter) : 1;
    let groupPaginator = []
    
    for(var x=0; x<=nGroupPaginator; x++){

      groupPaginator.push(pageNumbers.slice(start, end))
      
      start+=nLimiter
      end+=nLimiter
    }    

    return (
      <div className='AlignCob-pager' id="divPager" key={currentPage+'div'}>
        
        {loading && <LoadingOverlay active={loading} className='loadingCob-overlay' text="" styles={{content: {padding:'10% 0 0 45%'}, wrapper: {opacity: 1}}}></LoadingOverlay>}
        
        {(visiblePrev && !this.props.ressetPaginator ? (
          <Button key='begin' id='btnPagePrev' className="paginationCob-button" variant='outline-primary' disabled={this.state.disabledPrev} onClick={() => { this.clean(); this.setStatePagerClickArrow(groupPaginator, currentPage, 'btnPagePrev'); }}>&lsaquo;</Button>
        ) : (''))}

        {groupPaginator.map((paginator) => ( paginator.map((number, index) => {          

            // Definindo o estado padrão que determina o qula botão fica ativo
            let classPager = currentPage === number.page ? 'paginationCob-button active' : 'paginationCob-button'
        
            // Definindo botão 1 quando parametro ressetPaginator estiver presente
            if( this.props.ressetPaginator ){
              classPager = number.page === 1 ? 'paginationCob-button active' : 'paginationCob-button'
            }

            return (
              <React.Fragment key={currentPage+index}>
              {(index > 1 && index % groupLimiter === 0) ? (<br />) : ('') /*Introduz quebra do paginador como limitador */}
                <span key={number.page} onClick={() => this.setStateButtonPager(number.page, paginator.length)}>
                  <Button key={number.page+index} variant='outline-primary' className={classPager} onClick={() => { this.clean(); callbackList(listOfChecked, number.offset, null, number.page); }}>
                    <span>{number.page}</span>
                  </Button>
                </span>
              </React.Fragment>
            )
          })
        ))}
        {(visibleNext ? (
          <Button key='end' id='btnPageNext' className="paginationCob-button" variant='outline-primary' disabled={this.state.disabledNext} onClick={() => { this.clean(); this.setStatePagerClickArrow(groupPaginator, currentPage, 'btnPageNext'); }}>&rsaquo;</Button>
        ) : (''))}
      </div>
    );
  }
}

export default Pager