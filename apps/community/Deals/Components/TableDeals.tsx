import React, { Component } from 'react'
import Table, { TableProps, TableState } from 'adios/Table';
import FormDeal, { FormDealProps } from './FormDeal';
import request from 'adios/Request';

interface TableDealsProps extends TableProps {
  showArchive?: boolean,
}

interface TableDealsState extends TableState {
  showArchive: boolean,
  tableDealServicesDescription?: any,
  tableDealDocumentsDescription?: any,
}

export default class TableDeals extends Table<TableDealsProps, TableDealsState> {
  static defaultProps = {
    ...Table.defaultProps,
    itemsPerPage: 15,
    orderBy: {
      field: "id",
      direction: "desc"
    },
    formUseModalSimple: true,
    model: 'HubletoApp/Community/Deals/Models/Deal',
  }

  props: TableDealsProps;
  state: TableDealsState;

  translationContext: string = 'HubletoApp\\Community\\Deals\\Loader::Components\\TableDeals';

  constructor(props: TableDealsProps) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  getStateFromProps(props: TableDealsProps) {
    return {
      ...super.getStateFromProps(props),
      showArchive: props.showArchive ?? false,
    }
  }

  getFormModalProps(): any {
    let params = super.getFormModalProps();
    params.type = 'right wide';
    return params;
  }

  getEndpointParams(): any {
    return {
      ...super.getEndpointParams(),
      showArchive: this.state.showArchive ? 1 : 0,
    }
  }

  renderHeaderRight(): Array<JSX.Element> {
    let elements: Array<JSX.Element> = super.renderHeaderRight();

    if (!this.state.showArchive) {
      elements.push(
        <a className="btn btn-transparent" href="deals/archive">
          <span className="icon"><i className="fas fa-box-archive"></i></span>
          <span className="text">Show</span>
        </a>
      );
    }

    return elements;
  }

  renderCell(columnName: string, column: any, data: any, options: any) {
    if (columnName == "tags") {
      return (
        <>
          {data.TAGS.map((tag, key) => {
            return <div style={{backgroundColor: tag.TAG.color}} className='badge'>{tag.TAG.name}</div>;
          })}
        </>
      );
    } else {
      return super.renderCell(columnName, column, data, options);
    }
  }

  onAfterLoadTableDescription(description: any) {
    request.get(
      'api/table/describe',
      {
        model: 'HubletoApp/Community/Deals/Models/DealService',
        idDeal: this.props.recordId ?? description.idDeal,
      },
      (description: any) => {
        this.setState({tableDealServicesDescription: description} as TableDealsState);
      }
    );
    request.get(
      'api/table/describe',
      {
        model: 'HubletoApp/Community/Deals/Models/DealDocument',
        idDeal: this.props.recordId ?? description.idDeal,
      },
      (description: any) => {
        this.setState({tableDealDocumentsDescription: description} as TableDealsState);
      }
    );

    return description;
  }

  renderForm(): JSX.Element {
    let formProps = this.getFormProps() as FormDealProps;
    formProps.tableDealServicesDescription = this.state.tableDealServicesDescription;
    formProps.tableDealDocumentsDescription = this.state.tableDealDocumentsDescription;
    return <FormDeal {...formProps}/>;
  }
}