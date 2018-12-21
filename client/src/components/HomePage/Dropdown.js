import React, { Component } from 'react';

class Dropdown extends Component {
    state = {
        showMenu: false
    };
    showMenu = event => {
        event.preventDefault();
        this.setState({ showMenu: true }, () => {
            document.addEventListener("click", this.closeMenu);
        });
    };
    closeMenu = () => {
        this.setState({ showMenu: false }, () => {
            document.removeEventListener("click", this.closeMenu);
        });
    };
    selectOption = e => {
        e.preventDefault();
        this.props.handleChange(e);
    };
    render() {
        return (
            <div className={`custom-dropdown ${this.props.className || ""}`}>
                <div className={"button"} onClick={this.showMenu}>
                    {this.props.label ? this.props.label + ": " : ""}
                    {this.props.selected}
                </div>
                <div className={`options${this.state.showMenu ? "" : " hide-menu"}`}>
                    {this.props.options.map(option => (
                        <option
                            data-label={option.label}
                            value={option.value}
                            onClick={this.selectOption}
                            key={option.value + option.label}
                        >
                            {option.label}
                        </option>
                    ))}
                </div>
            </div>
        );
    }
}

export default Dropdown;