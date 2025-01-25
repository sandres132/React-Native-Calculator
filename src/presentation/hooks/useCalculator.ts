import { useEffect, useRef, useState } from "react"

enum Operator {
    add = '+',
    substract = '-',
    multiply = 'x',
    divide = '÷',
    percentage = '%',
}

export const useCalculator = () => {

    const [formula, setFormula] = useState('')

    const [number, setNumber] = useState('0');
    const [prevNumber, setPrevNumber] = useState('0');

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if ( lastOperation.current ) {
            const firstFormulaPart = formula.split( ' ' ).at(0);
            setFormula( `${ firstFormulaPart } ${ lastOperation.current } ${ number }`)
        }else {
            setFormula( number );
        }

    }, [number]);

    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber(`${ subResult }`)
    
    }, [formula])
    
    

    const clean = () => {
        setNumber('0');
        setPrevNumber('0');
        lastOperation.current = undefined;
        setFormula( '' );
    }

    const deleteOperation = () => {
        // // Codigo de Fernando
        // let currentSign = '';
        // let temporalNumber = number;

        // if ( number.includes('-') ) {
        //     currentSign = '-';
        //     temporalNumber = number.substring(1);
        // }

        // if ( temporalNumber.length > 1 ) {
        //     return setNumber( currentSign + temporalNumber.slice(0,-1) );
        // }

        // setNumber('0')

        // Codigo resolucion tarea
        // Evalua si el numero solo tiene un digito lo elimina y lo setea a 0
        if ( number.length === 1 ) {
            return setNumber( '0' );
        }

        // Evalua si el numero solo tiene 2 digitos y tiene un negativo lo elimina y lo setea a 0
        if ( number.includes('-') && number.length === 2 ) {
            return setNumber( '0' );
        }

        setNumber( number.slice(0, -1) );
    }

    const toggleSign = () => {
        if ( number.includes('-') ) {
            return setNumber( number.replace('-', '') )
        }

        setNumber( '-' + number );
    }

    const buildNumber = ( numberString: string ) => {
        // Condicion para que no agregue mas de un punto al numero
        if ( number.includes('.') && numberString === '.' ) return;

        // Condicion para verificar si el numero empieza con +/- cero
        if ( number.startsWith('0') || number.startsWith('-0') ){
            // Condicion para setear el numero a punto decimal +/- 0.
            if ( numberString === '.' ) {
                return setNumber( number + numberString );
            }

            // Evaluar si es otro cero y no hay punto
            if ( numberString === '0' && number.includes('.') ) {
                return setNumber( number + numberString );
            }

            // Evaluar si es diferente de 0 y no hay punto decimal y es el primer numero
            if ( numberString !== '0' && !number.includes('.') ) {
                return setNumber( numberString );
            }

            // Evitar 00000000
            if ( numberString === '0' && !number.includes('.') ) return;

            return setNumber( number + numberString );
        }


        setNumber( number + numberString );

    }

    const setLastNumber = () => {
        calculateResult();

        if ( number.endsWith('.') ) {
            setPrevNumber( number.slice(0, -1) );
        }else {
            setPrevNumber( number );
        }

        setNumber('0');
    }

    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide;
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply;
    }

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add;
    }

    const substractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.substract;
    }

    const percentageOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.percentage;
    }

    const calculateResult = () => {
        
        const result = calculateSubResult();
        setFormula( `${ result }` );

        lastOperation.current = undefined;
        setPrevNumber('0');
    }

    const calculateSubResult = (): number => {
        const [ firstValue, operation, secondValue ] = formula.split(' ');

        const num1 = Number( firstValue );
        const num2 = Number( secondValue );

        if ( isNaN( num2 ) ) return num1;

        switch ( operation ) {
            case Operator.add:
                return num1 + num2;

            case Operator.substract:
                return num1 - num2;

            case Operator.multiply:
                return num1 * num2;

            case Operator.divide:
                return num1 / num2;

            case Operator.percentage:
                return num1 % num2;

            default:
                throw new Error("Operation not implemented yet");
        }
    }

  return {
    // properties
    number,
    prevNumber,
    formula,

    // methods
    buildNumber,
    toggleSign,
    clean,
    deleteOperation,
    addOperation,
    divideOperation,
    multiplyOperation,
    percentageOperation,
    substractOperation,
    calculateResult,
  }
}
