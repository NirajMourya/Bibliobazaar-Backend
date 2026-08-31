import { jest } from '@jest/globals';

const mockSignUpService = jest.fn();
const mockLoginService = jest.fn();
const mockUpdateProfilePictureService = jest.fn();
const mockGetUserAccountService = jest.fn();
const mockGetUpdateAccountService = jest.fn();
const mockAddAddressService = jest.fn();
const mockEditAddressService = jest.fn();
const mockDeleteAddressService = jest.fn();
const mockAddressListService = jest.fn();
const mockAddToCartService = jest.fn();
const mockDeleteFromCartService = jest.fn();
const mockDeleteAllFromCartService = jest.fn();
const mockLogoutService = jest.fn();

const mockAddBookService = jest.fn();
const mockFindBookService = jest.fn();
const mockEditBookService = jest.fn();
const mockRemoveBookService = jest.fn();
const mockBookDetailsService = jest.fn();
const mockGetCollectionService = jest.fn();
const mockSearchLibService = jest.fn();

const mockRentDetailsService = jest.fn();
const mockIssuedHistoryService = jest.fn();
const mockOfferedHistoryService = jest.fn();
const mockAddHistoryService = jest.fn();

const mockUploadService = jest.fn();

const mockSearchService = jest.fn();

const mockCreateOrder = jest.fn();
const mockCreateHmac = jest.fn();

jest.unstable_mockModule('./services/user.services.js', () => ({
  signUpService: mockSignUpService,
  loginService: mockLoginService,
  updateProfilePictureService: mockUpdateProfilePictureService,
  getUserAccountService: mockGetUserAccountService,
  getUpdateAccountService: mockGetUpdateAccountService,
  addAddressService: mockAddAddressService,
  editAddressService: mockEditAddressService,
  deleteAddressService: mockDeleteAddressService,
  addressListService: mockAddressListService,
  addToCartService: mockAddToCartService,
  deleteFromCartService: mockDeleteFromCartService,
  deleteAllFromCartService: mockDeleteAllFromCartService,
  logoutService: mockLogoutService,
}));

jest.unstable_mockModule('./services/library.services.js', () => ({
  addBookService: mockAddBookService,
  findBookService: mockFindBookService,
  editBookService: mockEditBookService,
  removeBookService: mockRemoveBookService,
  bookDetailsService: mockBookDetailsService,
  getCollectionService: mockGetCollectionService,
  searchLibService: mockSearchLibService,
}));

jest.unstable_mockModule('./services/rent.services.js', () => ({
  RentDetailsService: mockRentDetailsService,
  IssuedHistoryService: mockIssuedHistoryService,
  OfferedHistoryService: mockOfferedHistoryService,
  addHistoryService: mockAddHistoryService,
}));

jest.unstable_mockModule('./services/upload.services.js', () => ({
  uploadService: mockUploadService,
}));

jest.unstable_mockModule('./services/search.services.js', () => ({
  searchService: mockSearchService,
}));

jest.unstable_mockModule('razorpay', () => ({
  default: jest.fn().mockImplementation(() => ({
    orders: { create: mockCreateOrder },
  })),
}));

jest.unstable_mockModule('crypto', () => ({
  default: {
    createHmac: mockCreateHmac,
  },
}));

const userController = await import('./controllers/user.controller.js');
const libraryController = await import('./controllers/library.controller.js');
const rentController = await import('./controllers/rent.controller.js');
const uploadController = await import('./controllers/upload.controller.js');
const searchController = await import('./controllers/search.controller.js');
const paymentController = await import('./controllers/payment.controller.js');

describe('controller integration coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateOrder.mockResolvedValue({ id: 'order_123' });
    mockCreateHmac.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue('signature'),
    });
  });

  test('user controller wiring calls the user service layer', () => {
    mockSignUpService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockLoginService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockUpdateProfilePictureService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockGetUserAccountService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockGetUpdateAccountService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockAddAddressService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockEditAddressService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockDeleteAddressService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockAddressListService.mockImplementation((body, cb) => cb(null, []));
    mockAddToCartService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockDeleteFromCartService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));
    mockDeleteAllFromCartService.mockImplementation((body, cb) => cb(null, { _id: 'user_1' }));

    const req = { body: { password: 'secret', emailId: 'test@example.com' }, user: { emailId: 'test@example.com', userId: 'user_1' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    userController.signUp(req, res, next);
    userController.login(req, res, next);
    userController.updateProfilePicture(req, res, next);
    userController.getUserAccount(req, res, next);
    userController.updateUserAccount(req, res, next);
    userController.addAddress(req, res, next);
    userController.editAddress(req, res, next);
    userController.deleteAddress(req, res, next);
    userController.addressesList(req, res, next);
    userController.addToCart(req, res, next);
    userController.deleteFromCart(req, res, next);
    userController.deleteAllFromCart(req, res, next);

    expect(mockSignUpService).toHaveBeenCalled();
    expect(mockLoginService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  test('library controller wiring calls the library service layer', () => {
    mockAddBookService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockFindBookService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockEditBookService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockRemoveBookService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockBookDetailsService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockGetCollectionService.mockImplementation((body, cb) => cb(null, []));
    mockSearchLibService.mockImplementation((body, cb) => cb(null, []));

    const req = { user: { userId: 'user_1' }, body: { isbn: '123', bookId: 'book_1' }, query: { q: 'abc' } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    libraryController.addBook(req, res, next);
    libraryController.findBook(req, res, next);
    libraryController.editBook(req, res, next);
    libraryController.removeBook(req, res, next);
    libraryController.bookDetails(req, res, next);
    libraryController.getCollection(req, res, next);
    libraryController.search(req, res, next);

    expect(mockAddBookService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('rent and upload controllers invoke their service callbacks', () => {
    mockRentDetailsService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockIssuedHistoryService.mockImplementation((body, cb) => cb(null, []));
    mockOfferedHistoryService.mockImplementation((body, cb) => cb(null, []));
    mockAddHistoryService.mockImplementation((body, cb) => cb(null, { ok: true }));
    mockUploadService.mockImplementation((body, cb) => cb(null, { url: 'https://example.com/image.jpg' }));

    const req = { body: { rentId: 'rent_1', bookArray: [], paymentMode: 'cash', trackingID: 't', address: {}, subTotal: 10, deliveryCharge: 1, totalAmount: 11, rentedOn: 'x', returnDate: 'y', razorpayOrderId: 'o', razorpayPaymentId: 'p' }, user: { userId: 'user_1' }, files: { file: { name: 'image.jpg' } }, query: {} };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn(), json: jest.fn() };
    const next = jest.fn();

    rentController.getRentDetails(req, res, next);
    rentController.getIssuedHistory(req, res, next);
    rentController.getOfferedHistory(req, res, next);
    rentController.addHistory(req, res, next);
    uploadController.upload(req, res, next);

    expect(mockAddHistoryService).toHaveBeenCalled();
    expect(mockUploadService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('search and payment controllers execute the main handlers', async () => {
    mockSearchService.mockImplementation((body, cb) => cb(null, { items: [] }));
    mockSearchService.mockImplementation((body, cb) => cb(null, { items: [] }));

    const req = { body: { amount: 10 }, query: { q: 'harry' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() };
    const next = jest.fn();

    searchController.searchBook(req, res, next);
    await paymentController.checkout(req, res, next);
    paymentController.paymentVerification({ body: { razorpay_order_id: 'o', razorpay_payment_id: 'p', razorpay_signature: 'sig' } }, res);

    expect(mockSearchService).toHaveBeenCalled();
    expect(mockCreateOrder).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
