var pubsubz = (function ( window, doc, undef ) {

    var topics = {},
        subUid = -1,
        subscribe = function (topic, func ) {
            var token;

            // create new topic if target topic isn't exist
            if (!topics[topic]) {
                topics[topic] = [];
            }

    		// add observer to observerlist(topics)
            token = (++subUid).toString();
            topics[topic].push({
                context: this,
                topic: topic,
                token: token,
                callback: func
            });

            return token;
        },
        publish = function (topic) {
            var args,
                len;

            // undefined check
            if (!topics[topic]) {
                return false;
            }

            args = Array.prototype.slice.call(arguments);
            len = topics[topic].length;

            for (var i = 0;i < len;i++) {
                var subscription = topics[topic][i];
                subscription.callback.apply(subscription.context, args);
            }

            // chain pattern
            return this;
        },
        unsubscribe = function (token) {
            for (var m in topics) {
                if (topics[m]) {
                    for (var i = 0, j = topics[m].length; i < j; i++) {
                        if (topics[m][i].token === token) {
                            topics[m].splice(i, 1);
                            return token;
                        }
                    }
                }
            }

            return false;
        },
        installTo = function (obj) {
            obj.subscribe = subscribe;
            obj.publish = publish;
            obj.unsubscribe = unsubscribe;
        };

        return {
            subscribe: subscribe,
            publish: publish,
            unsubscribe: unsubscribe,
            installTo: installTo,
        };
}(this, this.document, undefined));

module.exports = pubsubz;
