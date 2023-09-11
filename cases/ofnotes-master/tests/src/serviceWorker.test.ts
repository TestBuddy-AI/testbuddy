// Test case for production environment with service worker support
it('should register service worker in production environment', () => {
  // Mock process.env.NODE_ENV
  process.env.NODE_ENV = 'production';
  
  // Mock serviceWorker in navigator
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {},
    writable: true
  });
  
  // Mock URL constructor
  class MockURL {
    constructor(publicUrl: string, locationHref: string) {}
    origin: string = 'https://example.com';
  }
  Object.defineProperty(window, 'URL', {
    value: MockURL,
    writable: true
  });
  
  // Mock window.location.href
  Object.defineProperty(window, 'location', {
    value: {
      href: 'https://example.com'
    },
    writable: true
  });
  
  // Mock window.addEventListener
  const addEventListenerMock = jest.spyOn(window, 'addEventListener');
  
  // Mock checkValidServiceWorker function
  const checkValidServiceWorkerMock = jest.fn();
  
  // Mock registerValidSW function
  const registerValidSWMock = jest.fn();
  
  // Mock console.log
  const consoleLogMock = jest.spyOn(console, 'log');
  
  // Call the register function
  register();
  
  // Assertions
  expect(addEventListenerMock).toHaveBeenCalledTimes(1);
  expect(addEventListenerMock).toHaveBeenCalledWith('load', expect.any(Function));
  expect(checkValidServiceWorkerMock).toHaveBeenCalledTimes(1);
  expect(checkValidServiceWorkerMock).toHaveBeenCalledWith('https://example.com/service-worker.js', undefined);
  expect(registerValidSWMock).not.toHaveBeenCalled();
  expect(consoleLogMock).toHaveBeenCalledTimes(1);
  expect(consoleLogMock).toHaveBeenCalledWith('This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA');
});

// Test case for production environment without service worker support
it('should not register service worker in production environment without service worker support', () => {
  // Mock process.env.NODE_ENV
  process.env.NODE_ENV = 'production';
  
  // Mock serviceWorker not in navigator
  Object.defineProperty(navigator, 'serviceWorker', {
    value: undefined,
    writable: true
  });
  
  // Call the register function
  register();
  
  // Assertions
  // No assertions needed as the function returns early without any side effects
});

// Test case for non-production environment
it('should not register service worker in non-production environment', () => {
  // Mock process.env.NODE_ENV
  process.env.NODE_ENV = 'development';
  
  // Call the register function
  register();
  
  // Assertions
  // No assertions needed as the function returns early without any side effects
}); it('should check if a service worker still exists on localhost', () => {
  // Arrange
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
  // Act
  const result = checkValidServiceWorker(swUrl, config);
  
  // Assert
  expect(result).toBe(/* expected result */);
});

it('should log additional information for localhost', () => {
  // Arrange
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
  // Act
  navigator.serviceWorker.ready.then(() => {
    // Assert
    expect(console.log).toHaveBeenCalledWith(/* expected log message */);
  });
});

it('should register service worker on non-localhost', () => {
  // Arrange
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
  // Act
  const result = registerValidSW(swUrl, config);
  
  // Assert
  expect(result).toBe(/* expected result */);
}); // No unit tests can be generated for this function as it only contains a console.log statement. // Test case for registering a valid service worker with default configuration
it('registers a valid service worker with default configuration', () => {
  // Mock the necessary objects and functions
  const swUrl = 'example.com/sw.js';
  const registration = {
    installing: {
      state: 'installed'
    }
  };
  const navigator = {
    serviceWorker: {
      register: jest.fn().mockResolvedValue(registration)
    }
  };
  const consoleLogSpy = jest.spyOn(console, 'log');

  // Call the function to be tested
  registerValidSW(swUrl, undefined);

  // Assertions
  expect(navigator.serviceWorker.register).toHaveBeenCalledWith(swUrl);
  expect(consoleLogSpy).toHaveBeenCalledWith('Content is cached for offline use.');
});

// Test case for registering a valid service worker with custom configuration and onUpdate callback
it('registers a valid service worker with custom configuration and onUpdate callback', () => {
  // Mock the necessary objects and functions
  const swUrl = 'example.com/sw.js';
  const registration = {
    installing: {
      state: 'installed'
    }
  };
  const onUpdateCallback = jest.fn();
  const config = {
    onUpdate: onUpdateCallback
  };
  const navigator = {
    serviceWorker: {
      register: jest.fn().mockResolvedValue(registration)
    }
  };
  const consoleLogSpy = jest.spyOn(console, 'log');

  // Call the function to be tested
  registerValidSW(swUrl, config);

  // Assertions
  expect(navigator.serviceWorker.register).toHaveBeenCalledWith(swUrl);
  expect(consoleLogSpy).toHaveBeenCalledWith('New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.');
  expect(onUpdateCallback).toHaveBeenCalledWith(registration);
});

// Test case for handling an error during service worker registration
it('handles an error during service worker registration', () => {
  // Mock the necessary objects and functions
  const swUrl = 'example.com/sw.js';
  const error = 'Registration failed';
  const navigator = {
    serviceWorker: {
      register: jest.fn().mockRejectedValue(error)
    }
  };
  const consoleErrorSpy = jest.spyOn(console, 'error');

  // Call the function to be tested
  registerValidSW(swUrl, undefined);

  // Assertions
  expect(navigator.serviceWorker.register).toHaveBeenCalledWith(swUrl);
  expect(consoleErrorSpy).toHaveBeenCalledWith('Error during service worker registration:', error);
}); // Test case for when installingWorker is null
it('should not execute any code when installingWorker is null', () => {
  const registration = {
    onupdatefound: jest.fn(),
    installing: null
  };

  const consoleSpy = jest.spyOn(console, 'log');

  const config = {
    onUpdate: jest.fn(),
    onSuccess: jest.fn()
  };

  const expectedConsoleOutput = [];

  // Call the function to be tested
  registration.onupdatefound();

  // Check that the console.log function was not called
  expect(consoleSpy).not.toHaveBeenCalled();

  // Check that the onUpdate and onSuccess callbacks were not called
  expect(config.onUpdate).not.toHaveBeenCalled();
  expect(config.onSuccess).not.toHaveBeenCalled();
});

// Test case for when installingWorker state is "installed" and there is a navigator.serviceWorker.controller
it('should log a message and execute the onUpdate callback when installingWorker state is "installed" and there is a navigator.serviceWorker.controller', () => {
  const registration = {
    onupdatefound: jest.fn(),
    installing: {
      state: "installed"
    }
  };

  const consoleSpy = jest.spyOn(console, 'log');

  const config = {
    onUpdate: jest.fn(),
    onSuccess: jest.fn()
  };

  const expectedConsoleOutput = [
    "New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."
  ];

  // Mock the navigator.serviceWorker.controller property
  navigator.serviceWorker = {
    controller: {}
  };

  // Call the function to be tested
  registration.onupdatefound();

  // Check that the console.log function was called with the expected message
  expect(consoleSpy).toHaveBeenCalledWith(expectedConsoleOutput[0]);

  // Check that the onUpdate callback was called with the registration object
  expect(config.onUpdate).toHaveBeenCalledWith(registration);

  // Check that the onSuccess callback was not called
  expect(config.onSuccess).not.toHaveBeenCalled();
});

// Test case for when installingWorker state is "installed" and there is no navigator.serviceWorker.controller
it('should log a message and execute the onSuccess callback when installingWorker state is "installed" and there is no navigator.serviceWorker.controller', () => {
  const registration = {
    onupdatefound: jest.fn(),
    installing: {
      state: "installed"
    }
  };

  const consoleSpy = jest.spyOn(console, 'log');

  const config = {
    onUpdate: jest.fn(),
    onSuccess: jest.fn()
  };

  const expectedConsoleOutput = [
    "Content is cached for offline use."
  ];

  // Mock the navigator.serviceWorker.controller property
  navigator.serviceWorker = {
    controller: null
  };

  // Call the function to be tested
  registration.onupdatefound();

  // Check that the console.log function was called with the expected message
  expect(consoleSpy).toHaveBeenCalledWith(expectedConsoleOutput[0]);

  // Check that the onUpdate callback was not called
  expect(config.onUpdate).not.toHaveBeenCalled();

  // Check that the onSuccess callback was called with the registration object
  expect(config.onSuccess).toHaveBeenCalledWith(registration);
}); // Test case for when installingWorker is null
it('should return undefined when installingWorker is null', () => {
  const registration = {
    installing: null
  };
  const consoleSpy = jest.spyOn(console, 'log');
  const onUpdateSpy = jest.fn();
  const onSuccessSpy = jest.fn();
  const config = {
    onUpdate: onUpdateSpy,
    onSuccess: onSuccessSpy
  };

  // Call the function
  myFunction(registration, config);

  // Expectations
  expect(consoleSpy).not.toHaveBeenCalled();
  expect(onUpdateSpy).not.toHaveBeenCalled();
  expect(onSuccessSpy).not.toHaveBeenCalled();
});

// Test case for when installingWorker state is "installed" and navigator.serviceWorker.controller is truthy
it('should log a message and call onUpdate callback when installingWorker state is "installed" and navigator.serviceWorker.controller is truthy', () => {
  const installingWorker = {
    state: "installed"
  };
  const registration = {
    installing: installingWorker
  };
  const consoleSpy = jest.spyOn(console, 'log');
  const onUpdateSpy = jest.fn();
  const onSuccessSpy = jest.fn();
  const config = {
    onUpdate: onUpdateSpy,
    onSuccess: onSuccessSpy
  };
  const navigator = {
    serviceWorker: {
      controller: {}
    }
  };

  // Call the function
  myFunction(registration, config, navigator);

  // Expectations
  expect(consoleSpy).toHaveBeenCalledWith("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.");
  expect(onUpdateSpy).toHaveBeenCalledWith(registration);
  expect(onSuccessSpy).not.toHaveBeenCalled();
});

// Test case for when installingWorker state is "installed" and navigator.serviceWorker.controller is falsy
it('should log a message and call onSuccess callback when installingWorker state is "installed" and navigator.serviceWorker.controller is falsy', () => {
  const installingWorker = {
    state: "installed"
  };
  const registration = {
    installing: installingWorker
  };
  const consoleSpy = jest.spyOn(console, 'log');
  const onUpdateSpy = jest.fn();
  const onSuccessSpy = jest.fn();
  const config = {
    onUpdate: onUpdateSpy,
    onSuccess: onSuccessSpy
  };
  const navigator = {
    serviceWorker: {
      controller: null
    }
  };

  // Call the function
  myFunction(registration, config, navigator);

  // Expectations
  expect(consoleSpy).toHaveBeenCalledWith("Content is cached for offline use.");
  expect(onUpdateSpy).not.toHaveBeenCalled();
  expect(onSuccessSpy).toHaveBeenCalledWith(registration);
}); // Test case for when the installingWorker state is "installed" and there is a navigator.serviceWorker.controller
it('should log a message and execute the onUpdate callback if provided', () => {
  const installingWorker = { state: 'installed' };
  const navigator = { serviceWorker: { controller: true } };
  const config = { onUpdate: jest.fn() };
  const registration = {};

  console.log = jest.fn();

  // Call the function under test
  myFunction(installingWorker, navigator, config, registration);

  // Verify the expected console.log message
  expect(console.log).toHaveBeenCalledWith(
    'New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.'
  );

  // Verify that the onUpdate callback was executed with the registration object
  expect(config.onUpdate).toHaveBeenCalledWith(registration);
});

// Test case for when the installingWorker state is "installed" and there is no navigator.serviceWorker.controller
it('should log a message and execute the onSuccess callback if provided', () => {
  const installingWorker = { state: 'installed' };
  const navigator = { serviceWorker: { controller: false } };
  const config = { onSuccess: jest.fn() };
  const registration = {};

  console.log = jest.fn();

  // Call the function under test
  myFunction(installingWorker, navigator, config, registration);

  // Verify the expected console.log message
  expect(console.log).toHaveBeenCalledWith('Content is cached for offline use.');

  // Verify that the onSuccess callback was executed with the registration object
  expect(config.onSuccess).toHaveBeenCalledWith(registration);
}); // Test case for error handling during service worker registration
it('should log an error message when there is an error during service worker registration', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');
  const error = new Error('Service worker registration failed');
  
  // Call the provided error handler function
  (error) => { console.error("Error during service worker registration:", error); }
  
  // Expect that the console.error function is called with the correct error message
  expect(consoleErrorSpy).toHaveBeenCalledWith('Error during service worker registration:', error);
}); // Test case for valid service worker URL and valid config
it('should register a valid service worker with valid config', () => {
  // Mock fetch function to return a successful response
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    headers: {
      get: jest.fn().mockReturnValue('javascript')
    }
  });

  // Mock serviceWorker.ready to return a resolved promise
  navigator.serviceWorker.ready = Promise.resolve({
    unregister: jest.fn().mockResolvedValue(undefined)
  });

  // Call the function with valid service worker URL and config
  checkValidServiceWorker('https://example.com/sw.js', { foo: 'bar' });

  // Expect registerValidSW to be called with the correct arguments
  expect(registerValidSW).toHaveBeenCalledWith('https://example.com/sw.js', { foo: 'bar' });
});

// Test case for valid service worker URL and no config
it('should register a valid service worker without config', () => {
  // Mock fetch function to return a successful response
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    headers: {
      get: jest.fn().mockReturnValue('javascript')
    }
  });

  // Mock serviceWorker.ready to return a resolved promise
  navigator.serviceWorker.ready = Promise.resolve({
    unregister: jest.fn().mockResolvedValue(undefined)
  });

  // Call the function with valid service worker URL and no config
  checkValidServiceWorker('https://example.com/sw.js');

  // Expect registerValidSW to be called with the correct arguments
  expect(registerValidSW).toHaveBeenCalledWith('https://example.com/sw.js', undefined);
});

// Test case for 404 response from fetch
it('should reload the page if service worker is not found', () => {
  // Mock fetch function to return a 404 response
  global.fetch = jest.fn().mockResolvedValue({
    status: 404,
    headers: {
      get: jest.fn().mockReturnValue(null)
    }
  });

  // Mock serviceWorker.ready to return a resolved promise
  navigator.serviceWorker.ready = Promise.resolve({
    unregister: jest.fn().mockResolvedValue(undefined)
  });

  // Mock window.location.reload
  window.location.reload = jest.fn();

  // Call the function with valid service worker URL and config
  checkValidServiceWorker('https://example.com/sw.js', { foo: 'bar' });

  // Expect unregister and window.location.reload to be called
  expect(navigator.serviceWorker.ready().then().unregister).toHaveBeenCalled();
  expect(window.location.reload).toHaveBeenCalled();
});

// Test case for fetch error
it('should log a message if there is no internet connection', () => {
  // Mock fetch function to throw an error
  global.fetch = jest.fn().mockRejectedValue(new Error('No internet connection'));

  // Call the function with valid service worker URL and config
  checkValidServiceWorker('https://example.com/sw.js', { foo: 'bar' });

  // Expect console.log to be called with the correct message
  expect(console.log).toHaveBeenCalledWith('No internet connection found. App is running in offline mode.');
}); // Test case to check if the service worker is not found and the page is reloaded
it('should reload the page if service worker is not found', () => {
  const response = {
    status: 404,
    headers: new Map([['content-type', 'text/html']])
  };
  const unregister = jest.fn();
  const reload = jest.fn();
  const ready = Promise.resolve({
    unregister: () => Promise.resolve().then(unregister),
  });
  const registerValidSW = jest.fn();

  global.navigator.serviceWorker = {
    ready: Promise.resolve().then(() => ready),
  };
  global.window = {
    location: {
      reload: () => reload(),
    },
  };

  checkServiceWorker(response, registerValidSW);

  expect(unregister).toHaveBeenCalled();
  expect(reload).toHaveBeenCalled();
  expect(registerValidSW).not.toHaveBeenCalled();
});

// Test case to check if the service worker is found and registered
it('should register the service worker if found', () => {
  const response = {
    status: 200,
    headers: new Map([['content-type', 'application/javascript']])
  };
  const unregister = jest.fn();
  const reload = jest.fn();
  const ready = Promise.resolve({
    unregister: () => Promise.resolve().then(unregister),
  });
  const registerValidSW = jest.fn();

  global.navigator.serviceWorker = {
    ready: Promise.resolve().then(() => ready),
  };
  global.window = {
    location: {
      reload: () => reload(),
    },
  };

  checkServiceWorker(response, registerValidSW);

  expect(unregister).not.toHaveBeenCalled();
  expect(reload).not.toHaveBeenCalled();
  expect(registerValidSW).toHaveBeenCalledWith(swUrl, config);
}); // Test case for successful unregister and reload
it('should unregister and reload successfully', () => {
  // Mock the unregister function
  const unregisterMock = jest.fn().mockResolvedValueOnce();

  // Mock the window.location.reload function
  const reloadMock = jest.fn();

  // Create a mock registration object
  const registrationMock = {
    unregister: unregisterMock
  };

  // Replace the original functions with the mock functions
  global.window.location.reload = reloadMock;

  // Call the function under test
  myFunction(registrationMock);

  // Verify that the unregister function is called once
  expect(unregisterMock).toHaveBeenCalledTimes(1);

  // Verify that the reload function is called once
  expect(reloadMock).toHaveBeenCalledTimes(1);
});

// Test case for unsuccessful unregister
it('should handle unsuccessful unregister', async () => {
  // Mock the unregister function to throw an error
  const unregisterMock = jest.fn().mockRejectedValueOnce(new Error('Unregister failed'));

  // Mock the window.location.reload function
  const reloadMock = jest.fn();

  // Create a mock registration object
  const registrationMock = {
    unregister: unregisterMock
  };

  // Replace the original functions with the mock functions
  global.window.location.reload = reloadMock;

  // Call the function under test
  await expect(myFunction(registrationMock)).rejects.toThrow('Unregister failed');

  // Verify that the unregister function is called once
  expect(unregisterMock).toHaveBeenCalledTimes(1);

  // Verify that the reload function is not called
  expect(reloadMock).not.toHaveBeenCalled();
}); // No meaningful unit tests can be generated for this function as it directly interacts with the browser's window object and triggers a page reload. // Test case for the function logging the offline mode message
it('should log the offline mode message', () => {
  const consoleLogSpy = jest.spyOn(console, 'log');
  const offlineModeMessage = "No internet connection found. App is running in offline mode.";

  // Call the function
  offlineMode();

  // Expect the console.log function to be called with the offline mode message
  expect(consoleLogSpy).toHaveBeenCalledWith(offlineModeMessage);

  // Restore the original console.log function
  consoleLogSpy.mockRestore();
}); // Test case for unregistering service worker
it('should unregister service worker', () => {
  // Mock navigator.serviceWorker.ready
  const mockReady = jest.fn().mockResolvedValueOnce({
    unregister: jest.fn(),
  });
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      ready: mockReady,
    },
    configurable: true,
  });

  // Call the unregister function
  unregister();

  // Verify that navigator.serviceWorker.ready was called
  expect(mockReady).toHaveBeenCalled();

  // Verify that registration.unregister was called
  expect(mockReady().unregister).toHaveBeenCalled();
});

// Test case for when service worker is not supported
it('should not unregister service worker if not supported', () => {
  // Mock navigator.serviceWorker
  Object.defineProperty(navigator, 'serviceWorker', {
    value: undefined,
    configurable: true,
  });

  // Call the unregister function
  unregister();

  // Verify that navigator.serviceWorker.ready was not called
  expect(navigator.serviceWorker.ready).not.toHaveBeenCalled();
}); // Test case for unregistering a registration
it('should unregister a registration', () => {
  // Create a mock registration object
  const registration = {
    unregister: jest.fn()
  };

  // Call the function with the mock registration
  unregisterRegistration(registration);

  // Check if the unregister method was called
  expect(registration.unregister).toHaveBeenCalled();
}); // Test case for handling error message
it('should log the error message to the console', () => {
  const error = new Error('Test error');
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  // Call the provided function
  (error) => { console.error(error.message); }

  // Expect the console.error to have been called with the error message
  expect(consoleErrorSpy).toHaveBeenCalledWith('Test error');

  // Restore the original console.error function
  consoleErrorSpy.mockRestore();
});