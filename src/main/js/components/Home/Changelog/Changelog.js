import React from "react";
import {Paper} from "material-ui";
import "./changelog.less";
import New from "./New";
import Fix from "./Fix";
import Version from "./Version";

class Changelog extends React.Component {

    render() {
        return (
            <Paper className="changelog" style={{"padding": "10px"}}>
                <span>[+] - новый функционал, [*] - исправление</span>
                <Version version={"Version 0.0.7"}>
                    <New>Добавлен Changelog</New>
                    <Fix>Исправлен переход по кнопкам навигации. Прежде он работал только при клике на текст</Fix>
                    <Fix>Проверка контекста действий и операций учитывает обязательность и дефолтные значения</Fix>
                </Version>
            </Paper>
        );
    }
}

export default Changelog;