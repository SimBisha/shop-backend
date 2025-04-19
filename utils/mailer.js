const nodemailer = require('nodemailer');

// Set up the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderNotification = async (order) => {
  try {
    const address = order.address || {};

    // ✅ ADMIN EMAIL (you)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🛒 New Order Placed',
      html: `
        <h2>🆕 New Order Details</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer ID:</strong> ${order.userId}</p>
        <p><strong>Customer Email:</strong> ${order.userEmail || 'Not provided'}</p>
        <p><strong>Total Amount:</strong> €${order.amount}</p>

        <h3>Shipping Address:</h3>
        <p><strong>Name:</strong> ${address.name || 'N/A'}</p>
        <p><strong>City:</strong> ${address.city || 'N/A'}</p>
        <p><strong>Phone:</strong> ${address.phone || 'N/A'}</p>
        <p><strong>Address:</strong> ${address.adress || address.address || 'N/A'}</p>

        <h3>Products:</h3>
        <ul>
          ${order.products.map(product => `<li>${product.title} (Qty: ${product.quantity})</li>`).join('')}
        </ul>
      `,
    };

    await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin notification email sent.');

  // ✅ CUSTOMER EMAIL (if email is present)
  if (order.userEmail) {
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: order.userEmail,
      subject: '✅ Porosia juaj u përfundua me sukses!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h2 style="color: #27ae60; text-align: center;">🎉 Faleminderit për porosinë tuaj!</h2>
  
            <p style="font-size: 16px; color: #333; text-align: center;">
              Porosia juaj u pranua me sukses dhe është në përpunim. 📦
            </p>
  
            <div style="margin-top: 25px; background-color: #f2f2f2; padding: 15px 20px; border-radius: 10px;">
              <p style="margin: 0; font-size: 15px;">
                <strong>ID e Porosisë:</strong> ${order._id}<br/>
                <strong>Totali:</strong> €${order.amount.toFixed(2)}
              </p>
            </div>
  
            <h3 style="margin-top: 30px; color: #2c3e50;">🛍️ Produktet që keni porositur:</h3>
            <ul style="padding-left: 20px; color: #555;">
              ${order.products.map(product => `
                <li style="margin-bottom: 10px;">
                  <strong>${product.title}</strong> — sasia: ${product.quantity}
                </li>`).join('')}
            </ul>
  
            <p style="margin-top: 25px; font-size: 15px; color: #333;">
              Ne do t’ju kontaktojmë së shpejti për detajet e dorëzimit. Deri atëherë, jemi këtu për çdo pyetje që mund të keni. 📨
            </p>
  
            <div style="margin-top: 30px; text-align: center;">
              <p style="font-size: 14px; color: #777;">
                Faleminderit që na besuat. Ne vlerësojmë çdo klient dhe bëjmë më të mirën që çdo përvojë të jetë pozitive. 🙏
              </p>
            </div>
  
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #aaa; text-align: center;">
              Ky është një mesazh automatik. Ju lutemi mos u përgjigjni në këtë email.
            </p>
          </div>
        </div>
      `,
    };
  
  

      await transporter.sendMail(customerMailOptions);
      console.log('✅ Customer confirmation email sent.');
    } else {
      console.log('ℹ️ No customer email provided. Skipping customer notification.');
    }

  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
};

module.exports = { sendOrderNotification };
