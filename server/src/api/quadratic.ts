import { router } from ".";

const { solve } = require('../../wasm/quadratic/pkg/quadratic_lib.js');

router.post('/', async (request, response) => {
  let a, b, c;
  try {
    ({ a = parseInt(a), b = parseInt(b), c = parseInt(c) } = request.body)
    if (!a || !b || !c) {
      return response
        .status(400)
        .json({message: 'all operands must be provided'});
    }
    
    return response.status(200).json(solve([a, b, c]));
  } catch (error) {
    console.error(
      `solve({ params: ${[a, b, c]} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

module.exports = router;
