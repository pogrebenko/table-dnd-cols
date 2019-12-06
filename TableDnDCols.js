/*
 This is a jquery plug-in for build a table with DnD columns.

 Copyright 2013-2020 Vitaly Pogrebenko
 http://www.altanovasoftware.com/

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:
 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
;(function ($, window)
{
    $(
        function()
        {
            var pvaTable = 'pvaTable';

            $( document ).ready
            (
                function ()
                {
                    setTimeout(
                        function()
                        {
                            $( document ).trigger( 'afterdocumentready' );
                        }
                        , 1
                    );

                    $( document ).bind( 'afterdocumentready', afterDocumentReady );
                }
            );

            function afterDocumentReady()
            {
                var pvaTableID = function() { return '.' + pvaTable; };

                $( pvaTableID() ).each(
                    function()
                    {
                        init_dnd_cols( $( this ) );
                    }
                );
            }

            function init_dnd_cols( table )
            {
                var optionsDnD =
                {
                      dragClass : 'drag-column'
                    , overClass : 'over-column'
                };

                var $table = table, dragSrcItem = null, dragSrcEnter = null/*, cursor = null*/;

                if( isMSIE() === 9 )
                {
                    $table.find( 'thead tr th' ).each(
                        function()
                        {
                            if( $(this).find( '.drag-ie' ).length === 0 )
                            {
                                $(this).html(
                                    $('<a>').html( $(this).html() ).attr( 'href', '#' ).addClass( 'drag-ie' )
                                );
                            }
                        }
                    );
                }

                $table.find( 'thead tr th' ).each(
                    function()
                    {
                        this.setAttribute( 'draggable', true );

                        var _col = $( this );
                        _col.bind( 'dragstart', dragstart );
                        _col.bind( 'dragenter', dragenter );
                        _col.bind( 'dragleave', dragleave );
                        _col.bind( 'dragover' , dragover  );
                        _col.bind( 'drop'     , drop      );
                        _col.bind( 'dragend'  , dragend   );
                    }
                );

                jQuery.event.props.push( 'dataTransfer' );

                function dragstart( e )
                {
                    $(this).addClass( optionsDnD.dragClass );
                    dragSrcItem = this;

                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData( 'text/html', this.id );

                    //cursor = e.target.style.cursor;
                    //e.target.style.cursor = 'move';
                }
                function dragover( e )
                {
                    if( e.preventDefault )
                    {
                        e.preventDefault();
                    }
                    e.dataTransfer.dropEffect = 'move';
                }
                function dragenter( e )
                {
                    dragSrcEnter = this;
                    $table.find( 'thead tr th' ).each(
                        function ()
                        {
                            $(this).removeClass( optionsDnD.overClass );
                        }
                    );
                    $(this).addClass( optionsDnD.overClass );
                }
                function dragleave( e )
                {
                    if( dragSrcEnter !== e )
                    {
                        moveColumns( $(dragSrcEnter).index(), $(dragSrcItem).index() );
                    }
                }
                function drop( e )
                {
                    if( e.stopPropagation )
                    {
                        e.stopPropagation();
                    }

                    if( dragSrcItem !== e )
                    {
                        moveColumns( $( dragSrcItem ).index(), $(this).index() );
                    }
                }
                function dragend( e )
                {
                    var colPositions = {
                        array  : [],
                        object : {}
                    };

                    $table.find( 'thead tr th' ).each(
                        function ()
                        {
                            var _col = $(this);
                            var name = _col.attr('data-name') || _col.index();
                            _col.removeClass( optionsDnD.overClass );
                            colPositions.object[name] = _col.index();
                            colPositions.array.push( _col.index() );
                        }
                    );

                    $(dragSrcItem).removeClass( optionsDnD.dragClass );

                    //e.target.style.cursor = cursor;
                }

                function moveColumns( fromIdx, toIdx )
                {
                    var rows = $table.find( 'tr' );
                    for( var i = 0, n = rows.length; i < n; i ++ )
                    {
                        var item = rows[ i ];
                        if( toIdx > fromIdx )
                        {
                            insertAfter( item.children[ fromIdx ], item.children[ toIdx ] );
                        }
                        else
                        if( toIdx < $table.find( 'thead tr th' ).length - 1 )
                        {
                            item.insertBefore( item.children[ fromIdx ], item.children[ toIdx ] );
                        }
                    }
                }

                function insertAfter( item, refItem )
                {
                    return refItem.parentNode.insertBefore( item, refItem.nextSibling );
                }

                function isMSIE()
                {
                    var ua = navigator.userAgent.toLowerCase();
                    return ( ua.indexOf( 'msie' ) !== -1 ) ? parseInt( ua.split( 'msie' )[ 1 ] ) : false;
                }

            }

        }
    );
})(jQuery, window);
