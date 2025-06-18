export default function decorate(block) {
  block.innerHTML = `
    <form class="product-info">
      <label>First Name
        <input type="text" name="firstname" required />
      </label>
      <label>Last Name
        <input type="text" name="lastname" required />
      </label>
      <label>Email Address
        <input type="email" name="email" required />
      </label>
      <label>Password
        <input type="password" name="password" required />
      </label>
      <button type="submit">Create Customer</button>
    </form>
  `;

  const form = block.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const email = form.email.value;
    const password = form.password.value;

    const query = `
      mutation {
        createCustomerV2(
          input: {
            firstname: "${firstname}"
            lastname: "${lastname}"
            email: "${email}"
            password: "${password}"
          }
        ) {
          customer {
            firstname
            lastname
            email
            is_subscribed
          }
        }
      }
    `;

    try {
      const response = await fetch('https://edge-sandbox-graph.adobe.io/api/0804747e-2944-4ef2-b5f7-e1b7a1d6bc32/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer f75115a1f5c64e61a50e050543da9545',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result?.data?.createCustomerV2?.customer) {
        alert('Customer created successfully!');
        form.reset();
      } else {
        alert(' Failed to create customer. Check console for details.');
        console.error(result);
      }
    } catch (error) {
      console.error(' API call failed:', error);
      alert(' Network error. Please try again.');
    }
  });
}
