export const getQuery = (params) => {
    let query = {};
    const keys = Object.keys(params);
    if (keys && keys.length) {
        for (const key of keys) {
            if (params[key]) {
                query = { ...query, [key]: getQueryByField(params[key].option, params[key].value) };
            }
        }
    }
    return query;
};

export const OPERATORS = {
    EQ: 'EQ',
    EW: 'EW',
    GT: 'GT',
    IN: 'IN',
    LT: 'LT',
    SW: 'SW',
    WC: 'WC',
    GTE: 'GTE',
    LTE: 'LTE',
};

export const getQueryByField = (operator, value) => {
    switch (operator) {
        case OPERATORS.EQ:
            return value;
        case OPERATORS.GT:
            return { $gt: value };
        case OPERATORS.GTE:
            return { $gte: value };
        case OPERATORS.LT:
            return { $lt: value };
        case OPERATORS.LTE:
            return { $lte: value };
        case OPERATORS.WC:
            return new RegExp(value, 'gi');
        case OPERATORS.EW:
            return new RegExp(value + '$', 'i');
        case OPERATORS.SW:
            return new RegExp('^' + value, 'i');
        case OPERATORS.IN:
            return { $in: [...value.replace(/\s/g, '').split(',')] };
    }
};
