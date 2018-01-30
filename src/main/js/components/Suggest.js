import React from "react";
import Autosuggest from "react-autosuggest";
import PropTypes from "prop-types";

export default class Suggest extends React.Component {
    constructor(props) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            suggestions: []
        };
    }


    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    // Teach Autosuggest how to calculate suggestions for any given input value.
    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0 ? [] : this.props.suggestions.filter(item =>{
            let itemValue = item;
            if(this.props.field){
                itemValue = item[this.props.field];
            }

            return itemValue.toLowerCase().slice(0, inputLength) === inputValue
        }

        );
    };
    // When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
    getSuggestionValue = suggestion => {
        let result = suggestion;
        if (this.props.field) {
            result = suggestion[this.props.field]
        }
        return result;
    };

// Use your imagination to render suggestions.
    renderSuggestion = suggestion => {
        let result = suggestion;
        if (this.props.field) {
            result = suggestion[this.props.field]
        }
        return (
            <span>{result}</span>
        )
    };

    render() {

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: this.props.placeholder,
            value: this.props.value,
            onChange: this.props.onChange
        };
        return (
            <Autosuggest
                suggestions={this.state.suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}

Suggest.propTypes = {
    suggestions: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    field: PropTypes.string
}

