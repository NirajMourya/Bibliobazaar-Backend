import crypto from 'crypto';
import { jest } from '@jest/globals';

const mockSearchService = jest.fn();
const mockAddBookService = jest.fn();
const mockFindBookService = jest.fn();
const mockEditBookService = jest.fn();
const mockRemoveBookService = jest.fn();
const mockBookDetailsService = jest.fn();
const mockGetCollectionService = jest.fn();
const mockSearchLibService = jest.fn();
const mockCreateOrder = jest.fn();
const mockUploadService = jest.fn();
const mockSignUpService = jest.fn();
const mockLoginService = jest.fn();
const mockUpdateProfilePictureService = jest.fn();
const mockGetUserAccountService = jest.fn();
const mockGetUpdateAccountService = jest.fn();
const mockAddAddressService = jest.fn();
const mockEditAddressService = jest.fn();
const mockAddressListService = jest.fn();
const mockDeleteAddressService = jest.fn();
const mockAddToCartService = jest.fn();
const mockDeleteFromCartService = jest.fn();
const mockDeleteAllFromCartService = jest.fn();
const mockLogoutService = jest.fn();

jest.unstable_mockModule('../services/search.services.js', () => ({
  searchService: mockSearchService,
}));

jest.unstable_mockModule('../services/library.services.js', () => ({
  addBookService: mockAddBookService,
  findBookService: mockFindBookService,
  editBookService: mockEditBookService,
  removeBookService: mockRemoveBookService,
  bookDetailsService: mockBookDetailsService,
  getCollectionService: mockGetCollectionService,
  searchLibService: mockSearchLibService,
}));

jest.unstable_mockModule('razorpay', () => ({
  default: jest.fn().mockImplementation(() => ({
    orders: { create: mockCreateOrder },
  })),
}));

jest.unstable_mockModule('../services/upload.services.js', () => ({
  uploadService: mockUploadService,
}));

jest.unstable_mockModule('../services/user.services.js', () => ({
  signUpService: mockSignUpService,
  loginService: mockLoginService,
  updateProfilePictureService: mockUpdateProfilePictureService,
  getUserAccountService: mockGetUserAccountService,
  getUpdateAccountService: mockGetUpdateAccountService,
  addAddressService: mockAddAddressService,
  editAddressService: mockEditAddressService,
  addressListService: mockAddressListService,
  deleteAddressService: mockDeleteAddressService,
  addToCartService: mockAddToCartService,
  deleteFromCartService: mockDeleteFromCartService,
  deleteAllFromCartService: mockDeleteAllFromCartService,
  logoutService: mockLogoutService,
}));

const { searchBook } = await import('../controllers/search.controller.js');
const {
  search,
  addBook,
  findBook,
  editBook,
  removeBook,
  bookDetails,
  getCollection,
} = await import('../controllers/library.controller.js');
const { checkout, paymentVerification } = await import('../controllers/payment.controller.js');
const { upload } = await import('../controllers/upload.controller.js');
const {
  signUp,
  login,
  updateProfilePicture,
  getUserAccount,
  updateUserAccount,
  addAddress,
  editAddress,
  deleteAddress,
  addressesList,
  addToCart,
  deleteFromCart,
  deleteAllFromCart,
} = await import('../controllers/user.controller.js');

const buildRes = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe('controller branch coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('searchBook forwards errors to next middleware', () => {
    const req = { query: { q: 'harry' } };
    const res = buildRes();
    const next = jest.fn();

    mockSearchService.mockImplementation((params, cb) => cb(new Error('boom')));

    searchBook(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('searchBook returns early when query is missing', () => {
    const req = { query: undefined };
    const res = buildRes();
    const next = jest.fn();

    searchBook(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(mockSearchService).not.toHaveBeenCalled();
  });

  test('searchBook maps successful results and uses default pagination', () => {
    const req = { query: { q: 'harry' } };
    const res = buildRes();
    const next = jest.fn();

    mockSearchService.mockImplementation((params, cb) => cb(null, {
      totalItems: 1,
      items: [
        {
          volumeInfo: {
            title: 'Book One',
            authors: ['Author'],
            description: 'desc',
            industryIdentifiers: [{ type: 'ISBN_13', identifier: '123' }],
            imageLinks: { thumbnail: 'img' },
            categories: ['Fiction'],
            language: 'en',
          },
        },
      ],
    }));

    searchBook(req, res, next);

    expect(mockSearchService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Success',
      data: expect.objectContaining({ booksCount: 1 }),
    }));
  });

  test('library search uses default sort and order values', () => {
    const req = { query: {}, user: { userId: 'u1' } };
    const res = buildRes();
    const next = jest.fn();

    mockSearchLibService.mockImplementation((params, cb) => cb(null, { books: [] }));

    search(req, res, next);

    expect(mockSearchLibService).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'u1',
      page: 1,
      limit: 40,
      sortBy: 'rentExpected',
      order: 'asc',
    }), expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('library handlers delegate to service functions', () => {
    const res = buildRes();
    const next = jest.fn();

    mockAddBookService.mockImplementation((params, cb) => cb(null, { ok: true }));
    mockFindBookService.mockImplementation((params, cb) => cb(null, { ok: true }));
    mockEditBookService.mockImplementation((params, cb) => cb(null, { ok: true }));
    mockRemoveBookService.mockImplementation((params, cb) => cb(null, { ok: true }));
    mockBookDetailsService.mockImplementation((params, cb) => cb(null, { ok: true }));
    mockGetCollectionService.mockImplementation((params, cb) => cb(null, { ok: true }));

    addBook({ user: { userId: 'u1' }, body: { bookName: 'x' } }, res, next);
    findBook({ user: { userId: 'u1' }, body: { isbn: '1' } }, res, next);
    editBook({ user: { userId: 'u1' }, body: { bookId: 'b1' } }, res, next);
    removeBook({ user: { userId: 'u1' }, body: { bookId: 'b1' } }, res, next);
    bookDetails({ body: { userId: 'u1', bookId: 'b1' } }, res, next);
    getCollection({ user: { userId: 'u1' } }, res, next);

    expect(mockAddBookService).toHaveBeenCalled();
    expect(mockGetCollectionService).toHaveBeenCalled();
  });

  test('library handlers forward service errors to next middleware', () => {
    const res = buildRes();
    const next = jest.fn();

    mockAddBookService.mockImplementation((params, cb) => cb(new Error('add')));
    mockFindBookService.mockImplementation((params, cb) => cb(new Error('find')));
    mockEditBookService.mockImplementation((params, cb) => cb(new Error('edit')));
    mockRemoveBookService.mockImplementation((params, cb) => cb(new Error('remove')));
    mockBookDetailsService.mockImplementation((params, cb) => cb(new Error('details')));
    mockGetCollectionService.mockImplementation((params, cb) => cb(new Error('collection')));
    mockSearchLibService.mockImplementation((params, cb) => cb(new Error('search')));

    addBook({ user: { userId: 'u1' }, body: { bookName: 'x' } }, res, next);
    findBook({ user: { userId: 'u1' }, body: { isbn: '1' } }, res, next);
    editBook({ user: { userId: 'u1' }, body: { bookId: 'b1' } }, res, next);
    removeBook({ user: { userId: 'u1' }, body: { bookId: 'b1' } }, res, next);
    bookDetails({ body: { userId: 'u1', bookId: 'b1' } }, res, next);
    getCollection({ user: { userId: 'u1' } }, res, next);
    search({ user: { userId: 'u1' }, query: { q: 'x' } }, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('checkout creates a Razorpay order', async () => {
    const req = { body: { amount: 10 } };
    const res = buildRes();
    const next = jest.fn();

    mockCreateOrder.mockResolvedValueOnce({ id: 'order_1' });

    await checkout(req, res, next);

    expect(mockCreateOrder).toHaveBeenCalledWith({ amount: 1000, currency: 'INR' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('paymentVerification accepts authentic signatures', async () => {
    const signature = crypto.createHmac('sha256', 'secret').update('order_1|pay_1').digest('hex');
    const req = {
      body: {
        razorpay_order_id: 'order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: signature,
      },
    };
    const res = buildRes();

    process.env.RAZORPAY_SECRET = 'secret';

    await paymentVerification(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('paymentVerification rejects invalid signatures', async () => {
    const req = {
      body: {
        razorpay_order_id: 'order_1',
        razorpay_payment_id: 'pay_1',
        razorpay_signature: 'bad',
      },
    };
    const res = buildRes();

    process.env.RAZORPAY_SECRET = 'secret';

    await paymentVerification(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('upload delegates to the upload service', () => {
    const req = { files: { file: { name: 'img.jpg' } }, body: {} };
    const res = buildRes();
    const next = jest.fn();

    mockUploadService.mockImplementation((payload, cb) => cb(null, { url: 'x' }));

    upload(req, res, next);

    expect(mockUploadService).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: 'img.jpg' }),
      expect.any(Function),
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('upload forwards service errors to next middleware', () => {
    const req = { files: { file: { name: 'img.jpg' } }, body: {} };
    const res = buildRes();
    const next = jest.fn();

    mockUploadService.mockImplementation((payload, cb) => cb(new Error('upload failed')));

    upload(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  test('signup and login controllers delegate to the service layer', () => {
    const res = buildRes();
    const next = jest.fn();

    mockSignUpService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockLoginService.mockImplementation((payload, cb) => cb(null, { ok: true }));

    signUp({ body: { password: 'abc123' } }, res, next);
    login({ body: { emailId: 'a@b.com', password: 'abc123' } }, res, next);

    expect(mockSignUpService).toHaveBeenCalled();
    expect(mockLoginService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('profile and account controllers delegate to the service layer', () => {
    const res = buildRes();
    const next = jest.fn();

    mockUpdateProfilePictureService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockGetUserAccountService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockGetUpdateAccountService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockAddAddressService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockEditAddressService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockAddressListService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockDeleteAddressService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockAddToCartService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockDeleteFromCartService.mockImplementation((payload, cb) => cb(null, { ok: true }));
    mockDeleteAllFromCartService.mockImplementation((payload, cb) => cb(null, { ok: true }));

    updateProfilePicture({ body: { profilePicture: 'x' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    getUserAccount({ user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    updateUserAccount({ body: { firstName: 'A' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    addAddress({ body: { city: 'B' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    editAddress({ body: { city: 'C' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    deleteAddress({ body: { city: 'D' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    addressesList({ user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    addToCart({ body: { bookId: 'b1' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    deleteFromCart({ body: { cartId: 'c1' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    deleteAllFromCart({ user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);

    expect(mockUpdateProfilePictureService).toHaveBeenCalled();
    expect(mockDeleteAllFromCartService).toHaveBeenCalled();
  });

  test('profile and account controllers forward service errors to next middleware', () => {
    const res = buildRes();
    const next = jest.fn();

    mockUpdateProfilePictureService.mockImplementation((payload, cb) => cb(new Error('profile')));
    mockGetUserAccountService.mockImplementation((payload, cb) => cb(new Error('account')));
    mockGetUpdateAccountService.mockImplementation((payload, cb) => cb(new Error('update')));
    mockAddAddressService.mockImplementation((payload, cb) => cb(new Error('add-address')));
    mockEditAddressService.mockImplementation((payload, cb) => cb(new Error('edit-address')));
    mockAddressListService.mockImplementation((payload, cb) => cb(new Error('list')));
    mockDeleteAddressService.mockImplementation((payload, cb) => cb(new Error('delete')));
    mockAddToCartService.mockImplementation((payload, cb) => cb(new Error('add-cart')));
    mockDeleteFromCartService.mockImplementation((payload, cb) => cb(new Error('delete-cart')));
    mockDeleteAllFromCartService.mockImplementation((payload, cb) => cb(new Error('delete-all')));

    updateProfilePicture({ body: { profilePicture: 'x' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    getUserAccount({ user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    updateUserAccount({ body: { firstName: 'A' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    addAddress({ body: { city: 'B' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    editAddress({ body: { city: 'C' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    deleteAddress({ body: { city: 'D' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    addressesList({ user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    addToCart({ body: { bookId: 'b1' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    deleteFromCart({ body: { cartId: 'c1' }, user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);
    deleteAllFromCart({ user: { emailId: 'a@b.com', userId: 'u1' } }, res, next);

    expect(next).toHaveBeenCalled();
  });
});
