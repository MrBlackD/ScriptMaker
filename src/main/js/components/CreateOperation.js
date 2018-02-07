import React, {Component} from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography
} from "material-ui";
import Script from "./Script";


export default class CreateOperation extends Component {
    constructor(props){
        super(props);
        this.state= {
            dynamicParams: [],
            actions: [],
            conditions: [],
            script:[],
            operation:null,
            conditionCreationDialogOpened:false
        }
        jsPlumb.importDefaults({
            Connector:[ "Flowchart",{cornerRadius :30}],
            DragOptions : { cursor: "crosshair" },
        });
        this.onActionClick=this.onActionClick.bind(this);
        this.handleRequestCloseDialog=this.handleRequestCloseDialog.bind(this);
        this.loadDynamicParams();
        this.loadActions();
    }

    loadDynamicParams(){
        fetch(window.location.origin + "/api/dynamicParams").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({dynamicParams: json});
        });
    }

    loadActions(){
        fetch(window.location.origin + "/api/actions").then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            this.setState({actions: json});
        });
    }

    renderScript(){
        return (
            <div>
                <Button color={"accent"} className={"button_fullwidth"}>
                    <Typography color={"accent"} type="headline">{this.state.operation.name}</Typography>
                </Button>
                <Divider/>
                <Script nodes={this.state.script}/>
            </div>
        );
    }

    renderOperationCreation(){
        return(
            <div className="dialog__content padding">
                <TextField inputRef={(input) => { this.name = input; }} label="name" id="name" required={true}/>
                <TextField inputRef={(input) => { this.code = input; }} label="code" id="code" required={true}/>
                <TextField inputRef={(input) => { this.module = input; }} label="module" id="module" required={true}/>
                <TextField inputRef={(input) => { this.description = input; }} label="description" id="description" required={true}/>
                <TextField inputRef={(input) => { this.inParams = input; }} label="inParams" id="inParams" />
                <TextField inputRef={(input) => { this.outParams = input; }} label="outParams" id="outParams" />
                <Button variant="raised" onClick={()=>this.createOperation()}>Создать операцию</Button>
            </div>
        );
    }

    createOperation(){
        let name = this.name.value;
        this.name.value = "";
        let code = this.code.value;
        this.code.value = "";
        let description = this.description.value;
        this.description.value = "";
        let module = this.module.value;
        this.module.value = "";
        let inParams = this.inParams.value;
        this.inParams.value = "";
        let outParams = this.outParams.value;
        this.outParams.value = "";
        let operation = {name,code,description,module,inParams,outParams};
        console.log(operation);
        this.setState({operation:operation})

    }

    onActionClick(item){
        this.setState({script: [...this.state.script, {...item, timestamp:new Date().getTime()}]})
    }

    onDynamicParamClick(item){
        alert("NOT IMPLEMENTED YET");
    }

    renderConditionDialog(){
        return(
            <Dialog classes={{paper:"dialog"}} open={this.state.conditionCreationDialogOpened} onRequestClose={this.handleRequestCloseDialog}>
                <DialogTitle>
                    <Typography type="headline" gutterBottom>{"Добавление условия"}</Typography>
                </DialogTitle>
                <DialogContent classes={{root:"content"}}>
                    {this.renderConditionCreationForm()}
                </DialogContent>
            </Dialog>
        )
    }

    renderConditionCreationForm(){
        return(
            <div className={"dialog__content"}>
                <TextField id="newCondition"  inputRef={(input) => { this.newCondition = input; }} label="Condition" required={true}/>
                <Button color="secondary"  variant="raised" onClick={()=>{this.handleRequestCloseDialog();this.handleCreateCondition()}}>Add condition</Button>
            </div>
        );
    }

    handleRequestCloseDialog(){
        this.setState({conditionCreationDialogOpened:false});
    }

    onConditionClick(){
        this.setState({conditionCreationDialogOpened:true});
    }

    handleCreateCondition(){
        let condition ={
            id:new Date().getTime(),
            timestamp:new Date().getTime(),
            condition:this.newCondition.value,
        }
        this.setState({
            conditions:[...this.state.conditions, condition],
            script: [...this.state.script, condition]
        })
    }


    render() {

        let sidebarItems = this.state.operation?this.state.actions:this.state.dynamicParams;
        let onSidebarItemClick = this.state.operation?this.onActionClick:this.onDynamicParamClick;
        return (
            <div>
                <Grid gutter={0} container>
                    <Grid item xs={3}>
                        <Paper>
                            {this.state.operation&&<Button color={"accent"} className={"button_fullwidth"} onClick={()=>this.onConditionClick()}>Условие</Button>}
                            <Divider/>
                            <Button color={"accent"} className={"button_fullwidth"}>{this.state.operation?"Действия":"Динамические параметры"}</Button>
                            <Divider/>
                            <List>
                                {
                                    sidebarItems.map((item) => {
                                        return (
                                            <ListItem key={item["id"]} button>
                                                <ListItemText primary={item.name} onClick={()=>onSidebarItemClick(item)} secondary={item.code}/>
                                            </ListItem>
                                        );
                                    })
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={"operation__script__paper"}>
                            {this.renderConditionDialog()}
                            {this.state.operation?this.renderScript():this.renderOperationCreation()}
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }

}