import React, { Component } from 'react';

class Dropdown extends Component {
    state = {
        showMenu: false
    };
    showMenu = event => {
        event.preventDefault();
        this.setState({ showMenu: true }, () => {
            document.addEventListener("click", this.closeMenu);
            document.addEventListener("touchend", this.closeMenu);
        });
    };
    closeMenu = e => {
        e.preventDefault();
        this.setState({ showMenu: false }, () => {
            document.removeEventListener("click", this.closeMenu);
            document.removeEventListener("touchend", this.closeMenu)
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
                        <div className="custom-option"
                            data-label={option.label}
                            data-value={option.value}
                            onClick={this.selectOption}
                            key={option.value + option.label}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Dropdown;