
Template.new.helpers({

    'loadProperBtnLabel': () => {

        let label = 'Select';

        let c1 = Session.get('one').toString();
        let c2 = Session.get('two').toString();
        let c3 = Session.get('three').toString();

        if (c1 === 'none' && c2 === 'none' && c3 === 'none') {
            label = 'Select';
        }

        if (c1 !== 'none' && c2 === 'none' && c3 === 'none') {
            if (c1 === 'b') {
                label = 'Blue Mode';
            } else if (c1 === 'p') {
                label = 'Purple Mode';
            } else if (c1 === 'g') {
                label = 'Green Mode';
            }
        }

        else if (c1 === 'none' && c2 !== 'none' && c3 === 'none') {
            if (c2 === 'b') {
                label = 'Blue Mode';
            } else if (c2 === 'p') {
                label = 'Purple Mode';
            } else if (c2 === 'g') {
                label = 'Green Mode';
            }
        }

        else if (c1 === 'none' && c2 === 'none' && c3 !== 'none') {
            if (c3 === 'b') {
                label = 'Blue Mode';
            } else if (c3 === 'p') {
                label = 'Purple Mode';
            } else if (c3 === 'g') {
                label = 'Green Mode';
            }
        }

        else if (c1 !== 'none' && c2 !== 'none' && c3 !== 'none') {

            if (c1 === 'b') {
                if (c2 === 'p') {
                    label = 'Start B-P-G';
                } else if (c2 === 'g') {
                    label = 'Start B-G-P';
                }
            }

            else if (c1 === 'p') {
                if (c2 === 'b') {
                    label = 'Start P-B-G';
                } else if (c2 === 'g') {
                    label = 'Start P-G-B';
                }
            }

            else if (c1 === 'g') {
                if (c2 === 'b') {
                    label = 'Start G-B-P';
                } else if (c2 === 'p') {
                    label = 'Start G-P-B';
                }
            }

        }
        return label;
    },

});