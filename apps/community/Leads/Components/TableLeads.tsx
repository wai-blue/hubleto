import React, { Component } from 'react'
import Table, { TableProps, TableState } from 'adios/Table';
import FormLead, { FormLeadProps } from './FormLead';
import InputTags2 from 'adios/Inputs/Tags2';
import request from 'adios/Request';

interface TableLeadsProps extends TableProps {
  showArchive?: boolean,
}

interface TableLeadsState extends TableState {
  showArchive: boolean,
  tableLeadServicesDescription?: any,
  tableLeadDocumentsDescription?: any,
}

export default class TableLeads extends Table<TableLeadsProps, TableLeadsState> {
  static defaultProps = {
    ...Table.defaultProps,
    itemsPerPage: 15,
    orderBy: {
      field: "id",
      direction: "desc"
    },
    formUseModalSimple: true,
    model: 'HubletoApp/Community/Leads/Models/Lead',
  }

  props: TableLeadsProps;
  state: TableLeadsState;

  translationContext: string = 'HubletoApp\\Community\\Leads\\Loader::Components\\TableLeads';

  constructor(props: TableLeadsProps) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  getStateFromProps(props: TableLeadsProps) {
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
        <a className="btn btn-transparent" href="leads/archive">
          <span className="icon"><i className="fas fa-box-archive"></i></span>
          <span className="text">Archive</span>
        </a>
      );
    }

    return elements;
  }

  renderCell(columnName: string, column: any, data: any, options: any) {
    if (columnName == "id_lead_status") {
      if (data.STATUS && data.STATUS.color) {
        return <div style={{backgroundColor: data.STATUS.color}} className='badge'>{data.STATUS.name}</div>;
      }
    } else if (columnName == "tags") {
      return (
        <>
          {data.TAGS.map((tag, key) => {
            return <div style={{backgroundColor: tag.TAG.color}} className='badge' key={data.id + '-tags-' + key}>{tag.TAG.name}</div>;
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
        model: 'HubletoApp/Community/Leads/Models/LeadService',
        idLead: this.props.recordId ?? description.idLead,
      },
      (description: any) => {
        this.setState({tableLeadServicesDescription: description} as TableLeadsState);
      }
    );
    request.get(
      'api/table/describe',
      {
        model: 'HubletoApp/Community/Leads/Models/LeadDocument',
        idLead: this.props.recordId ?? description.idLead,
      },
      (description: any) => {
        this.setState({tableLeadDocumentsDescription: description} as TableLeadsState);
      }
    );
    return description;
  }

  renderForm(): JSX.Element {
    let formProps = this.getFormProps() as FormLeadProps;
    formProps.tableLeadServicesDescription = this.state.tableLeadServicesDescription;
    formProps.tableLeadDocumentsDescription = this.state.tableLeadDocumentsDescription;
    return <FormLead {...formProps}/>;
  }
}