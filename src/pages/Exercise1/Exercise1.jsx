import React, { Component } from "react";
import axios from "axios";
import DescriptionExercise from "../DescriptionExercise";
import { ReactComponent as PokeballIcon } from "../../assets/icons/pokeball.svg";
import classes from "./Exercise1.module.scss";
import Card from "./Card/Card";

const instructions = [
  "Identifique e corrija todos os pontos que estão impactando(ou podem impactar no futuro) a performance da página.",
  "Corrija os pontos do código que vão contra as convenções do React.",
  "Sempre que um item é mudado de lista, ele deve aparecer na primeira posição da outra lista.",
  "Não mude a estrutura da página (tabelas, cards, etc...) e nem dos componentes (Stateless -> Stateful / Stateful -> Stateless)",
  "Não use Hooks.",
  "A solução final não deve apresentar nenhum erro ou warning no console do browser."
];
class Exercise1 extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.state = {
      availableElements: [],
      selectedElements: []
    };
  }

  componentWillMount() {
    const getPokemonNumber = pokemonNumber => {
      if (pokemonNumber < 10) return `00${pokemonNumber}`;
      if (pokemonNumber < 100) return `0${pokemonNumber}`;
      return pokemonNumber;
    };
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=500`).then(res => {
      const availableElements = res.data.results.map((item, ix) => {
        return {
          number: getPokemonNumber(ix + 1),
          ...item
        };
      });
      this.setState({ availableElements });
    });
  }

  handleClick(index) {
    //use push is faster then concat
    this.state.selectedElements.push(
      ...this.state.availableElements.splice(index, 1)
    );

    if (this.state.selectedElements.length > 0) {
      this.setState({ selectedElements: this.state.selectedElements });
    }
  }

  handleRemove(indexRemove) {
    this.state.availableElements.unshift(
      this.state.selectedElements[indexRemove]
    );
    this.setState({
      availableElements: this.state.availableElements,
      selectedElements: this.state.selectedElements.filter(
        item => item !== this.state.selectedElements[indexRemove]
      )
    });
  }

  render() {
    const getPokemonIconURL = pokemonNumber =>
      `https://www.serebii.net/pokedex-sm/icon/${pokemonNumber}.png`;
    return (
      <div className={classes.Exercise1}>
        <DescriptionExercise instructions={instructions} />
        <div className={classes.Exercise1Container}>
          <div className={classes.AvailableContainer}>
            <table className={classes.Table}>
              <tbody>
                {this.state.availableElements.length > 0 &&
                  this.state.availableElements.map((element, index) => (
                    <tr key={index}>
                      <td className={classes.Number}>
                        <div>{`#${element.number}`}</div>
                      </td>
                      <td className={classes.Description}>
                        <div className={classes.PokemonContainer}>
                          <img
                            src={getPokemonIconURL(element.number)}
                            alt="Pokemon Icon"
                          />
                          <span>{element.name}</span>
                        </div>
                      </td>
                      <td className={classes.Action}>
                        <PokeballIcon
                          onClick={this.handleClick.bind(this, index)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={classes.CaptureContainer}>
            {this.state.selectedElements.length > 0 &&
              this.state.selectedElements.map((element, index) => (
                <Card
                  key={index}
                  number={`#${element.number}`}
                  name={element.name}
                  src={getPokemonIconURL(element.number)}
                  onClick={this.handleRemove.bind(this, index)}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Exercise1;
